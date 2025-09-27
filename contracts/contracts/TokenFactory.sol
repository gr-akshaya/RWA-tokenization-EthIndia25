// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "./ERC3643ZKToken.sol";
import "./ListingManager.sol";

contract TokenFactory is AccessControl {
    bytes32 public constant FACTORY_ADMIN_ROLE = keccak256("FACTORY_ADMIN_ROLE");
    ListingManager public listingManager;

    event TokenCreated(address indexed token, string name, string symbol);

    constructor(address listingManagerAddr, address admin) {
        listingManager = ListingManager(listingManagerAddr);
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(FACTORY_ADMIN_ROLE, admin);
    }

    function createTokenAndListing(
        string memory name,
        string memory symbol,
        uint256 supply,
        address verifier,
        string memory isin,
        string memory jurisdiction
    ) external onlyRole(FACTORY_ADMIN_ROLE) returns (address) {
        ERC3643ZKToken token = new ERC3643ZKToken(
            name,
            symbol,
            supply,
            verifier,
            msg.sender
        );

        listingManager.createListing(
            address(token),
            name,
            symbol,
            isin,
            jurisdiction,
            supply
        );

        emit TokenCreated(address(token), name, symbol);
        return address(token);
    }
}
