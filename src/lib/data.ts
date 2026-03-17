import labsSeed from "./labs.json";
import { Lab, LabCategory, LabQuestion } from "./types";

type LabsSeed = {
  categories: LabCategory[];
  labs: Lab[];
};

const dataset: LabsSeed = labsSeed as LabsSeed;

function normalizeQuestionType(question: LabQuestion): LabQuestion {
  const responseFormat = (question.responseFormat || "").toLowerCase();
  const title = question.title.toLowerCase();

  let normalizedType = question.type;

  if (responseFormat.includes("table")) {
    normalizedType = "table";
  } else if (
    responseFormat.includes("graph") ||
    responseFormat.includes("plot")
  ) {
    normalizedType = "plot";
  } else if (title.includes("table")) {
    normalizedType = "table";
  } else if (title.includes("graph") || title.includes("plot")) {
    normalizedType = "plot";
  }

  return {
    ...question,
    type: normalizedType,
    tableConfig:
      normalizedType === "table"
        ? question.tableConfig || {
            columns: ["col-1", "col-2", "col-3", "col-4"],
            rows: 5,
            headers: ["Column 1", "Column 2", "Column 3", "Column 4"],
          }
        : question.tableConfig,
    plotConfig:
      normalizedType === "plot"
        ? question.plotConfig || {
            xLabel: "X",
            yLabel: "Y",
            title: question.title,
          }
        : question.plotConfig,
  };
}

export const labCategories: LabCategory[] = dataset.categories;

export const labs: Lab[] = dataset.labs.map((lab) => ({
  ...lab,
  questions: (lab.questions || []).map(normalizeQuestionType),
}));

export const labQuestions: LabQuestion[] = labs.flatMap(
  (lab) => lab.questions || [],
);

export function getLabsByCategory(categoryId: string): Lab[] {
  return labs.filter((lab) => lab.category === categoryId);
}

export function getLabById(id: string): Lab | undefined {
  return labs.find((lab) => lab.id === id);
}

export function searchLabs(query: string): Lab[] {
  const lowercaseQuery = query.toLowerCase();

  return labs.filter(
    (lab) =>
      lab.title.toLowerCase().includes(lowercaseQuery) ||
      lab.description.toLowerCase().includes(lowercaseQuery) ||
      lab.topics.some((topic) =>
        topic.toLowerCase().includes(lowercaseQuery),
      ) ||
      (lab.tags || []).some((tag) =>
        tag.toLowerCase().includes(lowercaseQuery),
      ),
  );
}
