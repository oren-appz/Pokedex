import React from "react";
import { render } from "@testing-library/react";
import ErrorBoundary from "../../components/ErrorBoundary";

beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => { });
});

afterEach(() => {
    jest.restoreAllMocks();
});

describe("ErrorBoundary", () => {
    it("should display an error message when wrapped component throws an error", () => {
        const Bomb = () => {
            throw new Error("Boom!");
            return null;
        };

        const { getByText } = render(
            <ErrorBoundary>
                <Bomb />
            </ErrorBoundary>
        );

        expect(getByText("Oops! Something went wrong.")).toBeTruthy();
        expect(console.error).toHaveBeenCalled();

    });
    it("should display everything is fine when no error happens", () => {

        const { getByText } = render(
            <ErrorBoundary>
                <div>Everything is fine</div>
            </ErrorBoundary>
        );

        expect(getByText("Everything is fine")).toBeTruthy();
    });
});
