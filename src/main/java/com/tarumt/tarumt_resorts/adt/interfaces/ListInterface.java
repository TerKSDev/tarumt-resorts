//By Tek Shao Xian

package com.tarumt.tarumt_resorts.adt.interfaces;

public interface ListInterface<T> extends Iterable<T> {
    void add(T item);
    T get(int index);
    T remove(int index);
    int size();
    boolean isEmpty();
    Object[] toArray();
}
