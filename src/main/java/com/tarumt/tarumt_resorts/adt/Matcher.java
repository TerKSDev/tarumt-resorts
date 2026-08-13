package com.tarumt.tarumt_resorts.adt;

@FunctionalInterface
public interface Matcher<T> {
    boolean matches(T item);
}
