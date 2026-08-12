package com.tarumt.tarumt_resorts.interfaces;

public interface SimpleQueue<T> {
    void enqueue(T item);
    Object[] snapshot();
    int findIndex(Matcher<T> matcher);
    T removeAt(int index);
    int size();
    T get(int index);
}
