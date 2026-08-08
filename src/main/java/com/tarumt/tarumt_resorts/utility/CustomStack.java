package com.tarumt.tarumt_resorts.utility; // 确保包名正确

import com.tarumt.tarumt_resorts.entity.HousekeepingTask;

public class CustomStack {
    private Node top;
    private int size;

    private static class Node {
        HousekeepingTask data;
        Node next;
        Node(HousekeepingTask data) { this.data = data; }
    }

    public CustomStack() {
        this.top = null;
        this.size = 0;
    }

    public void push(HousekeepingTask item) {
        Node newNode = new Node(item);
        newNode.next = top;
        top = newNode;
        size++;
    }

    public HousekeepingTask pop() {
        if (isEmpty()) return null;
        HousekeepingTask item = top.data;
        top = top.next;
        size--;
        return item;
    }

    public boolean isEmpty() {
        return top == null;
    }
}