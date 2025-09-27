// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IVerifier {
    function isTransferAllowed(
        address operator,
        address from,
        address to,
        uint256 amount,
        bytes memory proof
    ) external view returns (bool);
}
