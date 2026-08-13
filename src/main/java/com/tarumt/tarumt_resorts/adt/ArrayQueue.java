package com.tarumt.tarumt_resorts.adt;

public class ArrayQueue<T> implements SimpleQueue<T> {
    private Object[] elements;
    private int front;
    private int size;

    public ArrayQueue() {
        this(16);
    }

    public ArrayQueue(int initialCapacity) {
        if (initialCapacity <= 0) {
            initialCapacity = 16;
        }
        this.elements = new Object[initialCapacity];
        this.front = 0;
        this.size = 0;
    }

    @Override
    public void enqueue(T item) {
        if (item == null) {
            throw new IllegalArgumentException("item is required");
        }
        if (size == elements.length) {
            grow();
        }
        int insertIndex = (front + size) % elements.length;
        elements[insertIndex] = item;
        size++;
    }

    @Override
    public Object[] snapshot() {
        Object[] arr = new Object[size];
        for (int i = 0; i < size; i++) {
            arr[i] = elements[(front + i) % elements.length];
        }
        return arr;
    }

    @Override
    public int findIndex(Matcher<T> matcher) {
        for (int i = 0; i < size; i++) {
            @SuppressWarnings("unchecked")
            T current = (T) elements[(front + i) % elements.length];
            if (current != null && matcher.matches(current)) {
                return i;
            }
        }
        return -1;
    }

    @Override
    public T removeAt(int index) {
        if (index < 0 || index >= size) {
            return null;
        }
        @SuppressWarnings("unchecked")
        T removed = (T) elements[(front + index) % elements.length];
        for (int i = index; i < size - 1; i++) {
            elements[(front + i) % elements.length] = elements[(front + i + 1) % elements.length];
        }
        elements[(front + size - 1) % elements.length] = null;
        size--;
        if (size == 0) {
            front = 0;
        } else if (front + size >= elements.length) {
            front = (front + 1) % elements.length;
        }
        return removed;
    }

    @Override
    public int size() {
        return size;
    }

    @Override
    public T get(int index) {
        if (index < 0 || index >= size) {
            return null;
        }
        @SuppressWarnings("unchecked")
        T value = (T) elements[(front + index) % elements.length];
        return value;
    }

    private void grow() {
        Object[] grown = new Object[elements.length * 2];
        for (int i = 0; i < size; i++) {
            grown[i] = elements[(front + i) % elements.length];
        }
        elements = grown;
        front = 0;
    }
}
