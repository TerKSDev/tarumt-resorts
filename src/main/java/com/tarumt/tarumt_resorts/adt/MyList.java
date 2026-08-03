package com.tarumt.tarumt_resorts.adt;

import java.util.Iterator;
import java.util.NoSuchElementException;

/**
 * A minimal, self-contained List ADT: a resizable array of elements
 * supporting add / get / size / iteration.
 *
 * This is written from scratch (no java.util.ArrayList underneath) to
 * satisfy the "implement your own collection ADT" assignment requirement.
 * Backed by a plain Object[] that doubles in capacity when full — the
 * same underlying strategy java.util.ArrayList itself uses, but built
 * here manually so all resizing/index logic is our own.
 */
public class MyList<T> implements Iterable<T> {

    private static final int DEFAULT_CAPACITY = 10;

    private Object[] elements;
    private int size;

    public MyList() {
        elements = new Object[DEFAULT_CAPACITY];
        size = 0;
    }

    /** Appends an item to the end of the list. */
    public void add(T item) {
        ensureCapacity();
        elements[size] = item;
        size++;
    }

    /** Returns the item at the given index. */
    @SuppressWarnings("unchecked")
    public T get(int index) {
        checkIndex(index);
        return (T) elements[index];
    }

    /** Removes and returns the item at the given index, shifting later items left. */
    @SuppressWarnings("unchecked")
    public T remove(int index) {
        checkIndex(index);
        T removed = (T) elements[index];
        for (int i = index; i < size - 1; i++) {
            elements[i] = elements[i + 1];
        }
        elements[size - 1] = null;
        size--;
        return removed;
    }

    public int size() {
        return size;
    }

    public boolean isEmpty() {
        return size == 0;
    }

    private void ensureCapacity() {
        if (size == elements.length) {
            Object[] bigger = new Object[elements.length * 2];
            for (int i = 0; i < size; i++) {
                bigger[i] = elements[i];
            }
            elements = bigger;
        }
    }

    private void checkIndex(int index) {
        if (index < 0 || index >= size) {
            throw new IndexOutOfBoundsException("Index: " + index + ", Size: " + size);
        }
    }

    @Override
    public Iterator<T> iterator() {
        return new Iterator<T>() {
            private int cursor = 0;

            @Override
            public boolean hasNext() {
                return cursor < size;
            }

            @Override
            @SuppressWarnings("unchecked")
            public T next() {
                if (!hasNext()) throw new NoSuchElementException();
                return (T) elements[cursor++];
            }
        };
    }
}
