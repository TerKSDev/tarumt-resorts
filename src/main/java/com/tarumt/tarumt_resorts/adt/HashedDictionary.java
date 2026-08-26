package com.tarumt.tarumt_resorts.adt;
import com.tarumt.tarumt_resorts.adt.interfaces.DictionaryInterface;

public class HashedDictionary<K, V> implements DictionaryInterface<K, V> {

  private TableEntry<K, V>[] hashTable;
  private int numberOfEntries;
  private static final int DEFAULT_SIZE = 101;

  public HashedDictionary() {
    this(DEFAULT_SIZE);
  }

  public HashedDictionary(int tableSize) {
    hashTable = new TableEntry[tableSize];
    numberOfEntries = 0;
  }

  public String toString() {
    String outputStr = "";
    for (int index = 0; index < hashTable.length; index++) {
      outputStr += String.format("%4d. ", index);
      if (hashTable[index] == null) {
        outputStr += "null " + "\n";
      } else if (hashTable[index].isRemoved()) {
        outputStr += "notIn " + "\n";
      } else {
        outputStr += hashTable[index].getKey() + " " + hashTable[index].getValue() + "\n";
      }
    }
    outputStr += "\n";
    return outputStr;
  }

  public V add(K key, V value) {
    V oldValue;

    if (isFull()) {
      rehash();
    }

    int index = getHashIndex(key);

    if ((hashTable[index] == null) || hashTable[index].isRemoved()) {
      hashTable[index] = new TableEntry<K, V>(key, value);
      numberOfEntries++;
      oldValue = null;
    } else {
      oldValue = hashTable[index].getValue();
      hashTable[index].setValue(value);
    }

    return oldValue;
  }

  public V remove(K key) {
    V removedValue = null;

    int index = getHashIndex(key);
    index = locate(index, key);

    if (index != -1) {
      removedValue = hashTable[index].getValue();
      hashTable[index].setToRemoved();
      numberOfEntries--;
    }
    return removedValue;
  }

  public V getValue(K key) {
    V result = null;

    int index = getHashIndex(key);
    index = locate(index, key);

    if (index != -1) {
      result = hashTable[index].getValue();
    }

    return result;
  }

  private int locate(int index, K key) {
    if (hashTable[index] == null || !key.equals(hashTable[index].getKey())) {
      return -1;
    } else {
      return index;
    }
  }

  public boolean contains(K key) {
    return getValue(key) != null;
  }

  public boolean isEmpty() {
    return numberOfEntries == 0;
  }

  public boolean isFull() {
    return false;
  }

  public int getSize() {
    return numberOfEntries;
  }

  public final void clear() {
    for (int index = 0; index < hashTable.length; index++) {
      hashTable[index] = null;
    }

    numberOfEntries = 0;
  }

  private int getHashIndex(K key) {
    int hashIndex = key.hashCode() % hashTable.length;
    if (hashIndex < 0) {
      hashIndex = hashIndex + hashTable.length;
    } 
    return hashIndex;
  } 

  private void rehash() {
    TableEntry<K, V>[] oldTable = hashTable;
    int oldSize = hashTable.length;
    int newSize = 2 * oldSize;
    hashTable = new TableEntry[newSize];
    numberOfEntries = 0;
    for (int index = 0; index < oldSize; index++) {
      if ((oldTable[index] != null) && oldTable[index].isIn()) {
        add(oldTable[index].getKey(), oldTable[index].getValue());
      }
    }
  }

  private class TableEntry<S, T> {

    private S key;
    private T value;
    private boolean inTable;

    private TableEntry(S searchKey, T dataValue) {
      key = searchKey;
      value = dataValue;
      inTable = true;
    }

    private S getKey() {
      return key;
    }

    private T getValue() {
      return value;
    }

    private void setValue(T newValue) {
      value = newValue;
    }

    private boolean isIn() {
      return inTable;
    }

    private boolean isRemoved() {
      return !inTable;
    }

    private void setToRemoved() {
      key = null;
      value = null;
      inTable = false;
    } 
  } 
} 
