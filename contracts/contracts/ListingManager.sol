// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";

contract ListingManager is AccessControl {
    bytes32 public constant LISTING_MANAGER_ROLE = keccak256("LISTING_MANAGER_ROLE");

    struct AssetListing {
        address tokenAddress;
        string name;
        string symbol;
        string isin;
        string jurisdiction;
        uint256 totalSupply;
    }

    AssetListing[] public listings;

    constructor(address admin) {
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(LISTING_MANAGER_ROLE, admin);
    }

    function createListing(
        address token,
        string memory name,
        string memory symbol,
        string memory isin,
        string memory jurisdiction,
        uint256 totalSupply
    ) external onlyRole(LISTING_MANAGER_ROLE) {
        listings.push(AssetListing(token, name, symbol, isin, jurisdiction, totalSupply));
    }

    function getAllListings() external view returns (AssetListing[] memory) {
        return listings;
    }

    function getListing(uint256 index) external view returns (AssetListing memory) {
        return listings[index];
    }

    function getListingCount() external view returns (uint256) {
        return listings.length;
    }
}
