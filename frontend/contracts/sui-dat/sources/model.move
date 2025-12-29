module sui_dat::model {
    use std::string::String;
    use sui::object::{Self, UID};
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};
    use sui::dynamic_field::{Self, add, borrow, borrow_mut, remove};
    use sui::bag::Bag;

    /// Model registry to store all models
    struct ModelRegistry has key {
        id: UID,
        models: Bag,
        latest_version: u64,
    }

    /// Model information
    struct Model has store {
        id: UID,
        version: u64,
        weights_cid: String,
        owner: address,
        created_at: u64,
        updated_at: u64,
        gradient_count: u64,
    }

    /// Gradient submission
    struct Gradient has store {
        contributor: address,
        model_version: u64,
        gradient_cid: String,
        timestamp: u64,
    }

    /// Pending gradients for a model version
    struct PendingGradients has store {
        gradients: vector<Gradient>,
    }

    const ENotAuthorized: u64 = 0;
    const EModelNotFound: u64 = 1;
    const EInvalidVersion: u64 = 2;
    const ENoPendingGradients: u64 = 3;

    /// Create a new model registry
    public entry fun create_registry(ctx: &mut TxContext) {
        let registry = ModelRegistry {
            id: object::new(ctx),
            models: Bag::new(ctx),
            latest_version: 0,
        };
        transfer::transfer(registry, tx_context::sender(ctx));
    }

    /// Create a new model
    public entry fun create_model(
        registry: &mut ModelRegistry,
        weights_cid: String,
        ctx: &mut TxContext
    ) {
        let version = registry.latest_version + 1;
        registry.latest_version = version;

        let model = Model {
            id: object::new(ctx),
            version,
            weights_cid,
            owner: tx_context::sender(ctx),
            created_at: tx_context::epoch(ctx),
            updated_at: tx_context::epoch(ctx),
            gradient_count: 0,
        };

        bag::add(&mut registry.models, version, model);
    }

    /// Submit a gradient for a model
    public entry fun submit_gradient(
        registry: &mut ModelRegistry,
        model_version: u64,
        gradient_cid: String,
        ctx: &mut TxContext
    ) {
        // Verify model exists
        assert!(bag::contains(&registry.models, model_version), EModelNotFound);

        // Create gradient submission
        let gradient = Gradient {
            contributor: tx_context::sender(ctx),
            model_version,
            gradient_cid,
            timestamp: tx_context::epoch(ctx),
        };

        // Add to pending gradients
        let field_name = format!("pending_{}", model_version);
        if (bag::contains(&registry.models, &field_name)) {
            let pending_mut = bag::borrow_mut<PendingGradients>(&mut registry.models, &field_name);
            vector::push_back(&mut pending_mut.gradients, gradient);
        } else {
            let pending = PendingGradients {
                gradients: vector[gradient],
            };
            bag::add(&mut registry.models, field_name, pending);
        }

        // Update model gradient count
        let model_mut = bag::borrow_mut<Model>(&mut registry.models, model_version);
        model_mut.gradient_count = model_mut.gradient_count + 1;
    }

    /// Finalize gradient aggregation and update model weights
    public entry fun finalize_aggregation(
        registry: &mut ModelRegistry,
        model_version: u64,
        new_weights_cid: String,
        ctx: &mut TxContext
    ) {
        // Verify model exists
        assert!(bag::contains(&registry.models, model_version), EModelNotFound);

        // Verify sender is authorized (in a real implementation, this would check admin rights)
        // For now, we'll allow the model owner to finalize
        let model_ref = bag::borrow<Model>(&registry.models, model_version);
        assert!(model_ref.owner == tx_context::sender(ctx), ENotAuthorized);

        // Update model weights
        let model_mut = bag::borrow_mut<Model>(&mut registry.models, model_version);
        model_mut.weights_cid = new_weights_cid;
        model_mut.updated_at = tx_context::epoch(ctx);

        // Clear pending gradients
        let field_name = format!("pending_{}", model_version);
        if (bag::contains(&registry.models, &field_name)) {
            let _: PendingGradients = bag::remove(&mut registry.models, &field_name);
        }
    }

    /// Get model by version (view function)
    public fun get_model_by_version(registry: &ModelRegistry, version: u64): &Model {
        assert!(bag::contains(&registry.models, version), EModelNotFound);
        bag::borrow(&registry.models, version)
    }

    /// Get latest model (view function)
    public fun get_latest_model(registry: &ModelRegistry): &Model {
        assert!(registry.latest_version > 0, EModelNotFound);
        bag::borrow(&registry.models, registry.latest_version)
    }

    /// Get pending gradients for a model version (view function)
    public fun get_pending_gradients(registry: &ModelRegistry, model_version: u64): vector<Gradient> {
        let field_name = format!("pending_{}", model_version);
        if (bag::contains(&registry.models, &field_name)) {
            let pending = bag::borrow<PendingGradients>(&registry.models, &field_name);
            pending.gradients
        } else {
            vector[]
        }
    }

    /// Helper function to format strings (simplified implementation)
    fun format(prefix: &str, value: u64): String {
        // In a real implementation, you would use the string::utf8 function
        // This is a simplified placeholder
        string::utf8(b"pending_123") // Placeholder implementation
    }
}