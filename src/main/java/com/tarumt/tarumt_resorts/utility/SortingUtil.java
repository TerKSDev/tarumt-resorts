package com.tarumt.tarumt_resorts.utility;

import com.tarumt.tarumt_resorts.adt.List;
import com.tarumt.tarumt_resorts.adt.interfaces.ListInterface;
import com.tarumt.tarumt_resorts.dto.RoomStatusSummaryDTO;
import com.tarumt.tarumt_resorts.dto.StaffTurnaroundDTO;
import com.tarumt.tarumt_resorts.entity.HousekeepingTask;

/**
 * Author: See Wei Jian
 *
 * Utility class that provides ADT conversion and manual sorting algorithms.
 * This class satisfies the requirement to implement sorting algorithms
 * without relying on SQL ORDER BY or the Java Collections Framework.
 */
public class SortingUtil {

    // 1. Convert an Iterable collection into the custom MyList ADT
    public static <T> ListInterface<T> toMyList(Iterable<T> iterable) {
        ListInterface<T> myList = new List<>();

        if (iterable != null) {
            for (T item : iterable) {
                myList.add(item);
            }
        }

        return myList;
    }

    // 2. Perform Insertion Sort to sort housekeeping tasks by creation date
    public static HousekeepingTask[] sortTasksByDate(
            ListInterface<HousekeepingTask> list,
            boolean descending) {

        HousekeepingTask[] arr = new HousekeepingTask[list.size()];

        for (int i = 0; i < list.size(); i++) {
            arr[i] = list.get(i);
        }

        // Insertion Sort
        for (int i = 1; i < arr.length; i++) {
            HousekeepingTask key = arr[i];
            int j = i - 1;

            if (descending) {
                // Descending order: newest tasks appear first
                while (j >= 0 &&
                        arr[j].getCreatedAt().isBefore(key.getCreatedAt())) {
                    arr[j + 1] = arr[j];
                    j--;
                }
            } else {
                // Ascending order: oldest tasks appear first
                while (j >= 0 &&
                        arr[j].getCreatedAt().isAfter(key.getCreatedAt())) {
                    arr[j + 1] = arr[j];
                    j--;
                }
            }

            arr[j + 1] = key;
        }

        return arr;
    }

    // 3. Perform Bubble Sort for the Room Status Report
    public static void bubbleSortByMinutesDesc(RoomStatusSummaryDTO[] arr) {

        for (int i = 0; i < arr.length - 1; i++) {
            for (int j = 0; j < arr.length - 1 - i; j++) {

                // Sort by minutes in the current stage in descending order
                if (arr[j].getMinutesInCurrentStage()
                        < arr[j + 1].getMinutesInCurrentStage()) {

                    RoomStatusSummaryDTO temp = arr[j];
                    arr[j] = arr[j + 1];
                    arr[j + 1] = temp;
                }
            }
        }
    }

    // 4. Perform Bubble Sort for the Staff Turnaround Report
    public static void bubbleSortByDurationAsc(StaffTurnaroundDTO[] arr) {

        for (int i = 0; i < arr.length - 1; i++) {
            for (int j = 0; j < arr.length - 1 - i; j++) {

                // Sort by turnaround duration in ascending order
                if (arr[j].getDurationMinutes()
                        > arr[j + 1].getDurationMinutes()) {

                    StaffTurnaroundDTO temp = arr[j];
                    arr[j] = arr[j + 1];
                    arr[j + 1] = temp;
                }
            }
        }
    }
}