module sui_dat::contributor {
    use sui::bag::{Self, Bag};

    /// Global configuration for the Sui-DAT protocol
    public struct GlobalConfig has key {
        id: UID,
        admin: address,
        min_stake: u64,
        reward_per_contribution: u64,
        contributors: Bag,
    }

    /// Contributor information
    public struct Contributor has store {
        address: address,
        reputation: u64,
        contributions: u64,
        last_contribution: u64,
    }

    const ENotAuthorized: u64 = 0;
    const EContributorNotFound: u64 = 1;

    /// Create global configuration
    public fun create_global_config(
        min_stake: u64,
        reward_per_contribution: u64,
        ctx: &mut TxContext
    ) {
        let config = GlobalConfig {
            id: object::new(ctx),
            admin: tx_context::sender(ctx),
            min_stake,
            reward_per_contribution,
            contributors: bag::new(ctx),
        };

        // Share the config object so it can be accessed by multiple users
        transfer::share_object(config);
    }

    /// Register a contributor
    public fun register_contributor(
        config: &mut GlobalConfig,
        ctx: &mut TxContext
    ) {
        let contributor_address = tx_context::sender(ctx);
        
        // Check if contributor already exists
        if (!bag::contains(&config.contributors, contributor_address)) {
            let contributor = Contributor {
                address: contributor_address,
                reputation: 0,
                contributions: 0,
                last_contribution: tx_context::epoch(ctx),
            };
            
            bag::add(&mut config.contributors, contributor_address, contributor);
        }
    }

    /// Award reputation
    public fun award_reputation(
        config: &mut GlobalConfig,
        contributor_address: address,
        amount: u64,
        ctx: &mut TxContext
    ) {
        assert!(config.admin == tx_context::sender(ctx), ENotAuthorized);
        assert!(bag::contains(&config.contributors, contributor_address), EContributorNotFound);

        let contributor = bag::borrow_mut<address, Contributor>(&mut config.contributors, contributor_address);
        contributor.reputation = contributor.reputation + amount;
    }

    /// Read-only contributor view
    public fun get_contributor(
        config: &GlobalConfig,
        contributor_address: address
    ): &Contributor {
        assert!(bag::contains(&config.contributors, contributor_address), EContributorNotFound);
        bag::borrow<address, Contributor>(&config.contributors, contributor_address)
    }

    /// Update contributor after contribution
    public fun update_contributor_after_contribution(
        config: &mut GlobalConfig,
        contributor_address: address,
        ctx: &mut TxContext
    ) {
        assert!(config.admin == tx_context::sender(ctx), ENotAuthorized);
        assert!(bag::contains(&config.contributors, contributor_address), EContributorNotFound);

        let contributor = bag::borrow_mut<address, Contributor>(&mut config.contributors, contributor_address);
        contributor.contributions = contributor.contributions + 1;
        contributor.last_contribution = tx_context::epoch(ctx);
        contributor.reputation = contributor.reputation + config.reward_per_contribution;
    }
}