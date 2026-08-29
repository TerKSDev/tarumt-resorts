package com.tarumt.tarumt_resorts.adt.interfaces;

public interface DictionaryInterface<K, V> {
  public V add(K key, V value);
  public V remove(K key);
  public V getValue(K key);
  public boolean contains(K key);
  public boolean isEmpty();
  public boolean isFull();
  public int getSize();
  public void clear();
}
