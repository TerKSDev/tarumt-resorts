package com.tarumt.tarumt_resorts.adt;

import com.tarumt.tarumt_resorts.adt.interfaces.StackInterface;

/**
 * Linked-list based implementation of the Stack ADT.
 * Used by HousekeepingControl to track the most recent status-change
 * action(s), enabling instant rollback.
 * Author: See Wei Jian
 */
public class Stack<T> implements StackInterface<T> {

    private Node<T> top;
    private int size;

    private static class Node<T> {
        T data;
        Node<T> next;
        Node(T data) { this.data = data; }
    }

    public Stack() {
        this.top = null;
        this.size = 0;
    }

    @Override
    public void push(T item) {
        Node<T> newNode = new Node<>(item);
        newNode.next = top;
        top = newNode;
        size++;
    }

    @Override
    public T pop() {
        if (isEmpty()) return null;
        T item = top.data;
        top = top.next;
        size--;
        return item;
    }

    @Override
    public T peek() {
        if (isEmpty()) return null;
        return top.data;
    }

    @Override
    public boolean isEmpty() {
        return top == null;
    }

    @Override
    public int size() {
        return size;
    }
}