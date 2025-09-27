// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "./IVerifier.sol";

contract ERC3643ZKToken is ERC20, AccessControl, Pausable {
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    address public verifier; // Proof contract (e.g., ProofOfHuman)

    constructor(
        string memory name_,
        string memory symbol_,
        uint256 initialSupply_,
        address verifier_,
        address admin
    ) ERC20(name_, symbol_) {
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(PAUSER_ROLE, admin);
        _grantRole(MINTER_ROLE, admin);

        verifier = verifier_;
        if (initialSupply_ > 0) {
            _mint(admin, initialSupply_);
        }
    }

    modifier onlyVerified(address from, address to, uint256 amount, bytes memory proof) {
        require(
            IVerifier(verifier).isTransferAllowed(msg.sender, from, to, amount, proof),
            "Compliance: transfer not allowed"
        );
        _;
    }

    function pause() external onlyRole(PAUSER_ROLE) {
        _pause();
    }

    function unpause() external onlyRole(PAUSER_ROLE) {
        _unpause();
    }

    function mint(address to, uint256 amount) external onlyRole(MINTER_ROLE) {
        _mint(to, amount);
    }

    function transferWithProof(address to, uint256 amount, bytes memory proof)
        external
        onlyVerified(msg.sender, msg.sender, to, amount, proof)
        returns (bool)
    {
        return super.transfer(to, amount);
    }

    function transferFromWithProof(address from, address to, uint256 amount, bytes memory proof)
        external
        onlyVerified(msg.sender, from, to, amount, proof)
        returns (bool)
    {
        _spendAllowance(from, msg.sender, amount);
        _transfer(from, to, amount);
        return true;
    }

    function _update(address from, address to, uint256 value) internal override {
        require(!paused(), "Token is paused");
        super._update(from, to, value);
    }
}
