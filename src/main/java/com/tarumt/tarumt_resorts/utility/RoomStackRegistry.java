package com.tarumt.tarumt_resorts.utility;

import com.tarumt.tarumt_resorts.entity.HousekeepingTask;

/**
 * Self-implemented registry that gives each room its own Stack ADT instance,
 * so a rollback for Room A can never accidentally undo an action on Room B.
 *
 * Implemented with plain arrays + linear search instead of java.util.HashMap,
 * to stay within the assignment's "no Java Collections Framework" constraint.
 * With a small number of rooms (typical for a single hotel property), linear
 * search is fast enough in practice; this is a reasonable trade-off to
 * discuss in the report (O(n) lookup vs. a self-built hash table).
 * Author: See Wei Jian
 */
public class RoomStackRegistry {

    private String[] roomIds;
    private CustomStack<HousekeepingTask>[] stacks;
    private int count;

    @SuppressWarnings("unchecked")
    public RoomStackRegistry() {
        this.roomIds = new String[16];
        this.stacks = new CustomStack[16];
        this.count = 0;
    }

    /** Returns the Stack for this room, creating a new empty one if it doesn't exist yet. */
    public CustomStack<HousekeepingTask> getStackFor(String roomId) {
        for (int i = 0; i < count; i++) {
            if (roomIds[i].equals(roomId)) {
                return stacks[i];
            }
        }
        if (count == roomIds.length) {
            resize();
        }
        CustomStack<HousekeepingTask> newStack = new CustomStack<>();
        roomIds[count] = roomId;
        stacks[count] = newStack;
        count++;
        return newStack;
    }

    @SuppressWarnings("unchecked")
    private void resize() {
        String[] newIds = new String[roomIds.length * 2];
        CustomStack<HousekeepingTask>[] newStacks = new CustomStack[stacks.length * 2];
        for (int i = 0; i < count; i++) {
            newIds[i] = roomIds[i];
            newStacks[i] = stacks[i];
        }
        roomIds = newIds;
        stacks = newStacks;
    }
}