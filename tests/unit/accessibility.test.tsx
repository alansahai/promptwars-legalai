/**
 * @jest-environment jsdom
 */
import "@testing-library/jest-dom";
import { render } from "@testing-library/react";
import { axe, toHaveNoViolations } from "jest-axe";
import DocumentUpload from "@/components/DocumentUpload";
import QAInterface from "@/components/QAInterface";

expect.extend(toHaveNoViolations);

describe("Accessibility", () => {
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
});
