package com.tarumt.tarumt_resorts.adt;

public interface MyQueue<T> {
    void enqueue(T item);
    Object[] snapshot();
    int indexOf(T item);
    T removeAt(int index);
    int size();
    T get(int index);
}
