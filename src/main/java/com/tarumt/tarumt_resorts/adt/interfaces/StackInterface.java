package com.tarumt.tarumt_resorts.adt.interfaces;
 
/**
 * Self-implemented Stack ADT specification (LIFO).
 * Team Collection ADT — see report for full specification/discussion.
 * Author: See Wei Jian
 */
public interface StackInterface<T> {
    void push(T item);
    T pop();
    T peek();
    boolean isEmpty();
    int size();
}