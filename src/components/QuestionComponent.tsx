"use client";

import React, { useEffect, useRef, useState } from "react";
import { LabQuestion, StudentAnswer } from "@/lib/types";
import DynamicIcon from "./DynamicIcon";
import MathText from "./MathText";

const defaultTableConfig = {
  columns: ["col-1", "col-2", "col-3", "col-4"],
  rows: 5,
  headers: ["Column 1", "Column 2", "Column 3", "Column 4"],
};

const defaultPlotConfig = {
  xLabel: "X",
  yLabel: "Y",
  title: "Data Plot",
};

const DEFAULT_PLOT_WIDTH = 400;
const DEFAULT_PLOT_HEIGHT = 300;

interface QuestionComponentProps {
  question: LabQuestion;
  answer?: StudentAnswer;
  onAnswerChange: (answer: Partial<StudentAnswer>) => void;
  isReadOnly?: boolean;
  showGrade?: boolean;
  grade?: number;
  maxGrade?: number;
  feedback?: string;
}

export default function QuestionComponent({
  question,
  answer,
  onAnswerChange,
  isReadOnly = false,
  showGrade = false,
  grade,
  maxGrade,
  feedback,
}: QuestionComponentProps) {
  const [isEditing, setIsEditing] = useState(!answer);
  const [plotScale, setPlotScale] = useState(10);
  const [plotOffset, setPlotOffset] = useState({ x: 0, y: 0 });
  const [cursorCoords, setCursorCoords] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [isPanning, setIsPanning] = useState(false);
  const [panState, setPanState] = useState<{
    startClientX: number;
    startClientY: number;
    startOffsetX: number;
    startOffsetY: number;
  } | null>(null);
  const plotFrameRef = useRef<HTMLDivElement | null>(null);
  const [plotViewport, setPlotViewport] = useState({
    width: DEFAULT_PLOT_WIDTH,
    height: DEFAULT_PLOT_HEIGHT,
  });

  useEffect(() => {
    const frame = plotFrameRef.current;
    if (!frame) return;

    const preventWheelScroll = (event: WheelEvent) => {
      event.preventDefault();
    };

    frame.addEventListener("wheel", preventWheelScroll, { passive: false });
    return () => {
      frame.removeEventListener("wheel", preventWheelScroll);
    };
  }, []);

  useEffect(() => {
    const frame = plotFrameRef.current;
    if (!frame) return;

    const updateViewport = () => {
      const rect = frame.getBoundingClientRect();
      const width = Math.max(1, Math.round(rect.width));
      const height = Math.max(1, Math.round(rect.height));
      setPlotViewport((prev) =>
        prev.width === width && prev.height === height
          ? prev
          : { width, height },
      );
    };

    updateViewport();
    const observer = new ResizeObserver(updateViewport);
    observer.observe(frame);
    return () => observer.disconnect();
  }, [question.type]);

  const handleTextAnswerChange = (text: string) => {
    onAnswerChange({
      questionId: question.id,
      labId: question.labId,
      type: "text",
      textAnswer: text,
      submittedAt: new Date(),
    });
  };

  const handleTableAnswerChange = (data: (string | number)[][]) => {
    onAnswerChange({
      questionId: question.id,
      labId: question.labId,
      type: "table",
      tableAnswer: { data },
      submittedAt: new Date(),
    });
  };

  const handlePlotAnswerChange = (points: { x: number; y: number }[]) => {
    onAnswerChange({
      questionId: question.id,
      labId: question.labId,
      type: "plot",
      plotAnswer: { points },
      submittedAt: new Date(),
    });
  };

  const renderTextQuestion = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Your Answer:
        </label>
        {isEditing && !isReadOnly ? (
          <textarea
            className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            rows={6}
            value={answer?.textAnswer || ""}
            onChange={(e) => handleTextAnswerChange(e.target.value)}
            placeholder="Enter your answer here..."
          />
        ) : (
          <div className="w-full px-3 py-2 border border-gray-200 bg-gray-50 min-h-[150px] whitespace-pre-wrap">
            {answer?.textAnswer || "No answer provided"}
          </div>
        )}
      </div>
    </div>
  );

  const renderTableQuestion = () => {
    const config = question.tableConfig || defaultTableConfig;
    const tableData =
      answer?.tableAnswer?.data ||
      Array(config.rows)
        .fill(null)
        .map(() => Array(config.columns.length).fill(""));

    return (
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Complete the table:
          </label>
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-300">
              <thead>
                <tr className="bg-gray-50">
                  {config.headers.map((header, index) => (
                    <th
                      key={index}
                      className="px-4 py-2 border border-gray-300 text-left font-medium text-gray-700"
                    >
                      <MathText text={header} inline />
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tableData.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    {row.map((cell, cellIndex) => (
                      <td
                        key={cellIndex}
                        className="px-4 py-2 border border-gray-300"
                      >
                        {isEditing && !isReadOnly ? (
                          <input
                            type="text"
                            className="w-full px-2 py-1 border border-gray-200 focus:outline-none focus:ring-1 focus:ring-primary-500"
                            value={cell}
                            onChange={(e) => {
                              const newData = [...tableData];
                              newData[rowIndex][cellIndex] = e.target.value;
                              handleTableAnswerChange(newData);
                            }}
                          />
                        ) : (
                          <span className="text-gray-900">{cell || "-"}</span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  const renderPlotQuestion = () => {
    const config = question.plotConfig || defaultPlotConfig;
    const plotData = answer?.plotAnswer?.points || [];
    const plotWidth = plotViewport.width;
    const plotHeight = plotViewport.height;

    const clampScale = (value: number) => Math.min(80, Math.max(2, value));

    const worldToScreen = (point: { x: number; y: number }) => ({
      sx: (point.x - plotOffset.x) * plotScale,
      sy: plotHeight - (point.y - plotOffset.y) * plotScale,
    });

    const screenToWorld = (
      clientX: number,
      clientY: number,
      rect: DOMRect,
      scale = plotScale,
      offset = plotOffset,
    ) => {
      const sx = ((clientX - rect.left) / rect.width) * plotWidth;
      const sy = ((clientY - rect.top) / rect.height) * plotHeight;
      const x = sx / scale + offset.x;
      const y = (plotHeight - sy) / scale + offset.y;
      return { x, y, sx, sy };
    };

    const plottedPoints = plotData.map((point) => worldToScreen(point));

    const getNiceStep = (rawStep: number) => {
      const magnitude = Math.pow(10, Math.floor(Math.log10(rawStep || 1)));
      const normalized = rawStep / magnitude;
      let nice = 1;
      if (normalized >= 5) nice = 5;
      else if (normalized >= 2) nice = 2;
      return nice * magnitude;
    };

    const gridStep = getNiceStep(40 / plotScale);
    const minX = plotOffset.x;
    const maxX = plotOffset.x + plotWidth / plotScale;
    const minY = plotOffset.y;
    const maxY = plotOffset.y + plotHeight / plotScale;

    const verticalGridLines: Array<{ sx: number; value: number }> = [];
    const horizontalGridLines: Array<{ sy: number; value: number }> = [];

    for (
      let value = Math.floor(minX / gridStep) * gridStep;
      value <= maxX + gridStep / 2;
      value += gridStep
    ) {
      const sx = (value - plotOffset.x) * plotScale;
      if (sx >= -1 && sx <= plotWidth + 1) {
        verticalGridLines.push({ sx, value });
      }
    }

    for (
      let value = Math.floor(minY / gridStep) * gridStep;
      value <= maxY + gridStep / 2;
      value += gridStep
    ) {
      const sy = plotHeight - (value - plotOffset.y) * plotScale;
      if (sy >= -1 && sy <= plotHeight + 1) {
        horizontalGridLines.push({ sy, value });
      }
    }

    const yAxisX = (0 - plotOffset.x) * plotScale;
    const xAxisY = plotHeight - (0 - plotOffset.y) * plotScale;
    const pointRadius = Math.max(1.5, Math.min(4, plotScale * 0.25));

    return (
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Plot your data:
          </label>
          <div className="border border-gray-300 bg-white p-4">
            <div className="text-center text-sm font-medium text-gray-700 mb-2">
              <MathText text={config.title} inline />
            </div>
            <div
              ref={plotFrameRef}
              className="relative bg-gray-50 h-80 border border-gray-200 overscroll-contain"
            >
              {/* Y-axis label */}
              <div className="absolute -left-8 top-1/2 transform -rotate-90 text-sm text-gray-600 font-medium">
                <MathText text={config.yLabel} inline />
              </div>

              {/* Plot area */}
              <svg
                className="w-full h-full"
                viewBox={`0 0 ${plotWidth} ${plotHeight}`}
              >
                {/* Grid lines (move/scale with pan/zoom) */}
                {verticalGridLines.map((line, index) => (
                  <line
                    key={`v-${index}`}
                    x1={line.sx}
                    y1={0}
                    x2={line.sx}
                    y2={plotHeight}
                    stroke="#e5e7eb"
                    strokeWidth={1}
                  />
                ))}
                {horizontalGridLines.map((line, index) => (
                  <line
                    key={`h-${index}`}
                    x1={0}
                    y1={line.sy}
                    x2={plotWidth}
                    y2={line.sy}
                    stroke="#e5e7eb"
                    strokeWidth={1}
                  />
                ))}

                {/* Axes */}
                {yAxisX >= -1 && yAxisX <= plotWidth + 1 && (
                  <line
                    x1={yAxisX}
                    y1={0}
                    x2={yAxisX}
                    y2={plotHeight}
                    stroke="#334155"
                    strokeWidth={1.5}
                  />
                )}
                {xAxisY >= -1 && xAxisY <= plotHeight + 1 && (
                  <line
                    x1={0}
                    y1={xAxisY}
                    x2={plotWidth}
                    y2={xAxisY}
                    stroke="#334155"
                    strokeWidth={1.5}
                  />
                )}

                {/* Plot points */}
                {plottedPoints.map((point, index) => (
                  <circle
                    key={index}
                    cx={point.sx}
                    cy={point.sy}
                    r={pointRadius}
                    fill="#057999"
                    className="cursor-pointer"
                  />
                ))}

                {/* Connecting lines */}
                {plottedPoints.length > 1 && (
                  <polyline
                    points={plottedPoints
                      .map((p) => `${p.sx},${p.sy}`)
                      .join(" ")}
                    fill="none"
                    stroke="#057999"
                    strokeWidth="2"
                  />
                )}
              </svg>

              {/* Click to add points instruction */}
              {isEditing && !isReadOnly && (
                <div className="absolute inset-0 flex items-center justify-center text-gray-500 text-sm pointer-events-none">
                  {plotData.length === 0 &&
                    "Left click: add point • Wheel: zoom • Right drag: pan"}
                </div>
              )}

              {/* Real-time cursor coordinates */}
              <div className="absolute top-2 right-2 px-2 py-1 text-xs bg-white/90 border border-gray-200 text-gray-700 pointer-events-none">
                {cursorCoords
                  ? `x: ${cursorCoords.x.toFixed(2)}, y: ${cursorCoords.y.toFixed(2)}`
                  : "x: -, y: -"}
              </div>

              {/* Interactive overlay */}
              {isEditing && !isReadOnly && (
                <div
                  className={`absolute inset-0 ${isPanning ? "cursor-grabbing" : "cursor-crosshair"}`}
                  onContextMenu={(e) => e.preventDefault()}
                  onMouseDown={(e) => {
                    if (e.button !== 2) return;
                    e.preventDefault();
                    setIsPanning(true);
                    setPanState({
                      startClientX: e.clientX,
                      startClientY: e.clientY,
                      startOffsetX: plotOffset.x,
                      startOffsetY: plotOffset.y,
                    });
                  }}
                  onMouseUp={() => {
                    setIsPanning(false);
                    setPanState(null);
                  }}
                  onMouseLeave={() => {
                    setIsPanning(false);
                    setPanState(null);
                    setCursorCoords(null);
                  }}
                  onMouseMove={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const world = screenToWorld(e.clientX, e.clientY, rect);
                    setCursorCoords({ x: world.x, y: world.y });

                    if (isPanning && panState) {
                      const dxPx =
                        ((e.clientX - panState.startClientX) / rect.width) *
                        plotWidth;
                      const dyPx =
                        ((e.clientY - panState.startClientY) / rect.height) *
                        plotHeight;
                      setPlotOffset({
                        x: panState.startOffsetX - dxPx / plotScale,
                        y: panState.startOffsetY + dyPx / plotScale,
                      });
                    }
                  }}
                  onWheel={(e) => {
                    e.preventDefault();
                    const rect = e.currentTarget.getBoundingClientRect();
                    const zoomFactor = e.deltaY < 0 ? 1.1 : 0.9;
                    const newScale = clampScale(plotScale * zoomFactor);

                    const {
                      x: worldX,
                      y: worldY,
                      sx,
                      sy,
                    } = screenToWorld(
                      e.clientX,
                      e.clientY,
                      rect,
                      plotScale,
                      plotOffset,
                    );

                    const newOffsetX = worldX - sx / newScale;
                    const newOffsetY = worldY - (plotHeight - sy) / newScale;

                    setPlotScale(newScale);
                    setPlotOffset({ x: newOffsetX, y: newOffsetY });
                  }}
                  onClick={(e) => {
                    if (e.button !== 0 || isPanning) return;
                    const rect = e.currentTarget.getBoundingClientRect();
                    const { x, y } = screenToWorld(e.clientX, e.clientY, rect);
                    const newPoints = [
                      ...plotData,
                      {
                        x: Math.round(x * 100) / 100,
                        y: Math.round(y * 100) / 100,
                      },
                    ];
                    handlePlotAnswerChange(newPoints);
                  }}
                />
              )}
            </div>

            {/* X-axis label */}
            <div className="text-center text-sm text-gray-600 font-medium mt-2">
              <MathText text={config.xLabel} inline />
            </div>

            {/* Data points list */}
            {plotData.length > 0 && (
              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">
                  Data Points:
                </h4>
                <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto">
                  {plotData.map((point, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center text-sm bg-gray-100 px-2 py-1"
                    >
                      <span>
                        ({point.x}, {point.y})
                      </span>
                      {isEditing && !isReadOnly && (
                        <button
                          onClick={() => {
                            const newPoints = plotData.filter(
                              (_, i) => i !== index,
                            );
                            handlePlotAnswerChange(newPoints);
                          }}
                          className="text-red-600 hover:text-red-800"
                        >
                          ×
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                {isEditing && !isReadOnly && (
                  <button
                    onClick={() => handlePlotAnswerChange([])}
                    className="mt-2 text-sm text-red-600 hover:text-red-800"
                  >
                    Clear All Points
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderQuestionContent = () => {
    switch (question.type) {
      case "text":
        return renderTextQuestion();
      case "table":
        return renderTableQuestion();
      case "plot":
        return renderPlotQuestion();
      default:
        return <div>Unsupported question type</div>;
    }
  };

  return (
    <div className="border border-gray-200 bg-white p-6 space-y-4">
      {/* Question Header */}
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-lg font-semibold text-gray-900">
              <MathText text={question.title} inline />
            </h3>
            {question.required && (
              <span className="text-red-500 text-sm">*</span>
            )}
            <span className="text-sm text-gray-500">
              ({question.points} points)
            </span>
          </div>
          <MathText
            text={question.description}
            className="text-gray-700 mb-2"
          />
          <MathText
            text={question.instruction}
            className="text-sm text-gray-600 italic"
          />
        </div>

        {/* Grade Display */}
        {showGrade && grade !== undefined && maxGrade !== undefined && (
          <div className="ml-4 text-right">
            <div className="text-lg font-semibold text-gray-900">
              {grade}/{maxGrade}
            </div>
            <div className="text-sm text-gray-600">points</div>
          </div>
        )}
      </div>

      {/* Question Content */}
      {renderQuestionContent()}

      {/* Action Buttons */}
      {!isReadOnly && (
        <div className="flex justify-between items-center pt-4 border-t border-gray-200">
          <div className="flex items-center gap-2">
            {answer && !isEditing && (
              <>
                <DynamicIcon
                  name="CheckmarkFilled"
                  size={16}
                  className="text-green-600"
                />
                <span className="text-sm text-green-600">Answered</span>
              </>
            )}
          </div>

          <div className="flex gap-2">
            {answer && !isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 transition-colors duration-200"
              >
                <DynamicIcon name="Edit" size={16} />
                Edit Answer
              </button>
            ) : (
              <button
                onClick={() => setIsEditing(false)}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 transition-colors duration-200"
              >
                <DynamicIcon name="Save" size={16} />
                Save Answer
              </button>
            )}
          </div>
        </div>
      )}

      {/* Feedback */}
      {feedback && (
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200">
          <h4 className="text-sm font-medium text-blue-900 mb-1">
            Instructor Feedback:
          </h4>
          <p className="text-sm text-blue-800">{feedback}</p>
        </div>
      )}
    </div>
  );
}
