/**
 * @jest-environment jsdom
 */
import "@testing-library/jest-dom";
import { render, act } from "@testing-library/react";
import { axe, toHaveNoViolations } from "jest-axe";
import DocumentUpload from "@/components/DocumentUpload";
import QAInterface from "@/components/QAInterface";
import ComparisonView from "@/components/ComparisonView";
import AnalysisResult from "@/components/AnalysisResult";

import Custom404 from "../../pages/404";

jest.mock("next/link", () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  return function MockLink({ children, href, prefetch, ...rest }: { children: React.ReactNode; href: string; prefetch?: boolean }) {
    return (
      <a href={href} {...rest}>
        {children}
      </a>
    );
  };
});

expect.extend(toHaveNoViolations);

describe("Accessibility", () => {
  test("Custom404 page renders without accessibility violations", async () => {
    let containerElement: HTMLElement;
    await act(async () => {
      const { container } = render(<Custom404 />);
      containerElement = container;
    });
    expect(await axe(containerElement!)).toHaveNoViolations();
  });
  test("DocumentUpload has no detectable accessibility violations", async () => {
    const { container } = render(
      <DocumentUpload label="Upload a legal document to get started" onUploaded={() => undefined} />
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  test("DocumentUpload's trigger button has an accessible name", () => {
    const { getByRole } = render(<DocumentUpload label="Upload a document" onUploaded={() => undefined} />);
    expect(getByRole("button", { name: /choose document/i })).toBeInTheDocument();
  });

  test("QAInterface has no detectable accessibility violations", async () => {
    const { container } = render(<QAInterface documentId="doc-1" />);
    expect(await axe(container)).toHaveNoViolations();
  });

  test("QAInterface's question field has an accessible label", () => {
    const { getByRole } = render(<QAInterface documentId="doc-1" />);
    expect(getByRole("textbox", { name: /ask a question about this document/i })).toBeInTheDocument();
  });

  test("ComparisonView renders without accessibility violations", async () => {
    const { container } = render(<ComparisonView documentId="doc-1" />);
    expect(await axe(container)).toHaveNoViolations();
  });

  test("AnalysisResult renders buttons and states without accessibility violations", async () => {
    const { container, getByRole } = render(
      <AnalysisResult documentId="doc-1" analysisType="simplify" />
    );
    expect(getByRole("button", { name: /run simplification/i })).toBeInTheDocument();
    expect(await axe(container)).toHaveNoViolations();
  });
});
