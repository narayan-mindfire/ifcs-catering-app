import { useMemo } from "react";
import { getIconForPreparationType } from "../components/preparation/PreparationUtils";
import { PreparationItem } from "../types/preparations";

export const usePreparationData = (
  preparations: PreparationItem[],
  selectedFilters: string[],
) => {
  const filterOptions = useMemo(() => {
    const uniqueNames = Array.from(
      new Set(
        preparations
          .map((p) => p.preparedBy)
          .filter((name): name is string => !!name),
      ),
    );
    return uniqueNames.map((name) => ({
      label: name,
      icon: getIconForPreparationType(name),
    }));
  }, [preparations]);

  const sectionedData = useMemo(() => {
    let filtered = preparations;
    if (selectedFilters.length > 0) {
      filtered = preparations.filter((p) =>
        selectedFilters.includes(p.preparedBy || ""),
      );
    }

    const grouped: Record<string, PreparationItem[]> = {};
    filtered.forEach((item) => {
      const key = item.preparedBy || "Unassigned";
      if (!grouped[key]) {
        grouped[key] = [];
      }
      grouped[key].push(item);
    });

    return Object.keys(grouped)
      .sort()
      .map((key) => ({
        title: key,
        data: grouped[key],
      }));
  }, [preparations, selectedFilters]);

  return { filterOptions, sectionedData };
};
