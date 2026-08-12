package com.tarumt.tarumt_resorts.interfaces;

public interface MyListInterface<T> extends Iterable<T> {
    void add(T item);
    T get(int index);
    T remove(int index);
    int size();
    boolean isEmpty();
    Object[] toArray();
}