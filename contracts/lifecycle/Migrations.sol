pragma solidity ^0.4.8;

import "zeppelin-solidity/contracts/ownership/Ownable.sol";

contract Migrations is Ownable {
    uint256 public lastCompletedMigration;

    // A function with the signature `setCompleted(uint)` is required.
    function setCompleted(uint256 completed) public onlyOwner {
        lastCompletedMigration = completed;
    }

    function upgrade(address newAddress) public onlyOwner {
        Migrations upgraded = Migrations(newAddress);
        upgraded.setCompleted(lastCompletedMigration);
    }
}