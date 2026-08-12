package com.tarumt.tarumt_resorts.interfaces;

@FunctionalInterface
public interface Matcher<T> {
    boolean matches(T item);
}
