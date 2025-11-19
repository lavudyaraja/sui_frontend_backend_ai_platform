module sui_dat::model {
    use std::string::String;
    use sui::bag::{Self, Bag};

    /// Model registry object
    public struct ModelRegistry has key {
        id: UID,
        models: Bag,
        latest_version: u64,
    }

    /// Model info
    public struct Model has store {
        version: u64,
        weights_cid: String,
        owner: address,
        created_at: u64,
        updated_at: u64,
        gradient_count: u64,
    }

    /// Gradient submission
    public struct Gradient has store, drop, copy {
        contributor: address,
        model_version: u64,
        gradient_cid: String,
        timestamp: u64,
    }

    /// Pending gradient list
    public struct PendingGradients has store, drop {
        gradients: vector<Gradient>,
    }

    const ENotAuthorized: u64 = 0;
    const EModelNotFound: u64 = 1;

    /// Create registry
    public fun create_registry(ctx: &mut TxContext) {
        let registry = ModelRegistry {
            id: object::new(ctx),
            models: bag::new(ctx),
            latest_version: 0,
        };
        transfer::share_object(registry);
    }

    /// Create a model
    public fun create_model(
        registry: &mut ModelRegistry,
        weights_cid: String,
        ctx: &mut TxContext
    ) {
        let version = registry.latest_version + 1;
        registry.latest_version = version;

        let model = Model {
            version,
            weights_cid,
            owner: tx_context::sender(ctx),
            created_at: tx_context::epoch(ctx),
            updated_at: tx_context::epoch(ctx),
            gradient_count: 0,
        };

        bag::add(&mut registry.models, version, model);
    }

    /// Submit gradient
    public fun submit_gradient(
        registry: &mut ModelRegistry,
        model_version: u64,
        gradient_cid: String,
        ctx: &mut TxContext
    ) {
        assert!(bag::contains(&registry.models, model_version), EModelNotFound);

        let gradient = Gradient {
            contributor: tx_context::sender(ctx),
            model_version,
            gradient_cid,
            timestamp: tx_context::epoch(ctx),
        };

        // Pending key = model_version + LARGE_OFFSET (unique key)
        let pending_key = model_version + 1_000_000_000;

        if (bag::contains(&registry.models, pending_key)) {
            let pending = bag::borrow_mut<u64, PendingGradients>(&mut registry.models, pending_key);
            vector::push_back(&mut pending.gradients, gradient);
        } else {
            let pending = PendingGradients {
                gradients: vector[gradient],
            };
            bag::add(&mut registry.models, pending_key, pending);
        };

        let model_mut = bag::borrow_mut<u64, Model>(&mut registry.models, model_version);
        model_mut.gradient_count = model_mut.gradient_count + 1;
    }

    /// Finalize aggregation
    public fun finalize_aggregation(
        registry: &mut ModelRegistry,
        model_version: u64,
        new_weights_cid: String,
        ctx: &mut TxContext
    ) {
        assert!(bag::contains(&registry.models, model_version), EModelNotFound);

        let model_ref = bag::borrow<u64, Model>(&registry.models, model_version);
        assert!(model_ref.owner == tx_context::sender(ctx), ENotAuthorized);

        let model_mut = bag::borrow_mut<u64, Model>(&mut registry.models, model_version);
        model_mut.weights_cid = new_weights_cid;
        model_mut.updated_at = tx_context::epoch(ctx);

        let pending_key = model_version + 1_000_000_000;
        if (bag::contains(&registry.models, pending_key)) {
            let _pending: PendingGradients = bag::remove(&mut registry.models, pending_key);
        }
    }

    public fun get_model_by_version(registry: &ModelRegistry, version: u64): &Model {
        assert!(bag::contains(&registry.models, version), EModelNotFound);
        bag::borrow<u64, Model>(&registry.models, version)
    }

    public fun get_latest_model(registry: &ModelRegistry): &Model {
        assert!(registry.latest_version > 0, EModelNotFound);
        bag::borrow<u64, Model>(&registry.models, registry.latest_version)
    }

    public fun get_pending_gradients(
        registry: &ModelRegistry,
        model_version: u64
    ): vector<Gradient> {
        let pending_key = model_version + 1_000_000_000;
        if (bag::contains(&registry.models, pending_key)) {
            let pending = bag::borrow<u64, PendingGradients>(&registry.models, pending_key);
            *&pending.gradients
        } else {
            vector[]
        }
    }
}