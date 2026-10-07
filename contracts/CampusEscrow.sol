// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/// @title CampusEscrow - decentralized escrow for second-hand trades
/// @notice Buyer's payment is locked in the contract until the buyer confirms receipt.
contract CampusEscrow {
    enum Status { Listed, Paid, Completed, Cancelled, Refunded }

    struct Item {
        address seller;
        address buyer;
        string name;
        uint256 price;   // in wei
        uint256 paidAt;  // timestamp of payment
        Status status;
    }

    // Use a short value (e.g. 1 minutes) on a test deployment to demo refunds.
    uint256 public constant REFUND_TIMEOUT = 7 days;

    Item[] private items;

    event ItemListed(uint256 indexed id, address indexed seller, string name, uint256 price);
    event ItemPaid(uint256 indexed id, address indexed buyer, uint256 amount);
    event ItemCompleted(uint256 indexed id, address indexed seller, uint256 amount);
    event ItemCancelled(uint256 indexed id);
    event ItemRefunded(uint256 indexed id, address indexed buyer, uint256 amount);

    /// Transaction 1: seller lists an item
    function listItem(string calldata name, uint256 price) external {
        require(bytes(name).length > 0, "Name required");
        require(price > 0, "Price must be > 0");
        items.push(Item(msg.sender, address(0), name, price, 0, Status.Listed));
        emit ItemListed(items.length - 1, msg.sender, name, price);
    }

    /// Transaction 2: buyer pays; funds are locked in the contract
    function buyItem(uint256 id) external payable {
        require(id < items.length, "Item not found");
        Item storage it = items[id];
        require(it.status == Status.Listed, "Not available");
        require(msg.sender != it.seller, "Seller cannot buy own item");
        require(msg.value == it.price, "Wrong payment amount");

        it.buyer = msg.sender;
        it.paidAt = block.timestamp;
        it.status = Status.Paid;
        emit ItemPaid(id, msg.sender, msg.value);
    }

    /// Transaction 3: buyer confirms receipt; funds are released to the seller
    function confirmReceipt(uint256 id) external {
        require(id < items.length, "Item not found");
        Item storage it = items[id];
        require(it.status == Status.Paid, "Not in paid state");
        require(msg.sender == it.buyer, "Only buyer");

        it.status = Status.Completed; // update state before transferring (reentrancy safety)
        (bool ok, ) = payable(it.seller).call{value: it.price}("");
        require(ok, "Transfer failed");
        emit ItemCompleted(id, it.seller, it.price);
    }

    /// Seller cancels an unsold item
    function cancelItem(uint256 id) external {
        require(id < items.length, "Item not found");
        Item storage it = items[id];
        require(msg.sender == it.seller, "Only seller");
        require(it.status == Status.Listed, "Cannot cancel");
        it.status = Status.Cancelled;
        emit ItemCancelled(id);
    }

    /// Buyer reclaims funds if the timeout has passed without confirmation
    function refund(uint256 id) external {
        require(id < items.length, "Item not found");
        Item storage it = items[id];
        require(it.status == Status.Paid, "Not in paid state");
        require(msg.sender == it.buyer, "Only buyer");
        require(block.timestamp >= it.paidAt + REFUND_TIMEOUT, "Timeout not reached");

        it.status = Status.Refunded;
        (bool ok, ) = payable(it.buyer).call{value: it.price}("");
        require(ok, "Refund failed");
        emit ItemRefunded(id, it.buyer, it.price);
    }

    function getItemCount() external view returns (uint256) {
        return items.length;
    }

    function getItem(uint256 id) external view returns (
        address seller, address buyer, string memory name,
        uint256 price, uint256 paidAt, Status status
    ) {
        require(id < items.length, "Item not found");
        Item storage it = items[id];
        return (it.seller, it.buyer, it.name, it.price, it.paidAt, it.status);
    }
}
