package com.tarumt.tarumt_resorts.adt;

@FunctionalInterface
public interface MyMatcher<T> {
    boolean matches(T item);
}
