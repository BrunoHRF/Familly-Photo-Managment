import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import AlbumList from "../src/views/components/AlbumList";
jest.mock("../src/views/components/AlbumList", () => ({
  ...jest.requireActual("../src/views/components/AlbumList"),
  fetchAlbums: jest.fn(),
  deleteAlbum: jest.fn(),
  updateAlbum: jest.fn(),
}));

import {
  fetchAlbums,
  deleteAlbum,
  updateAlbum,
} from "../src/views/components/AlbumList";
const queryClient = new QueryClient();

const renderWithQueryClient = (ui: React.ReactElement) => {
  return render(
    <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>
  );
};

describe("AlbumList Component", () => {
  const mockAlbums = [
    { id: 1, title: "Album 1", userId: 1 },
    { id: 2, title: "Album 2", userId: 1 },
  ];

  beforeEach(() => {
    (fetchAlbums as jest.Mock).mockResolvedValue(mockAlbums);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders loading state initially", () => {
    renderWithQueryClient(<AlbumList userId={1} onAlbumSelect={jest.fn()} />);
    expect(screen.getByText(/Loading albums/i)).toBeInTheDocument();
  });

  it("renders albums after fetching", async () => {
    renderWithQueryClient(<AlbumList userId={1} onAlbumSelect={jest.fn()} />);

    await waitFor(() => {
      expect(screen.getByText("Album 1")).toBeInTheDocument();
      expect(screen.getByText("Album 2")).toBeInTheDocument();
    });
  });

  it("handles album deletion", async () => {
    (deleteAlbum as jest.Mock).mockResolvedValueOnce(undefined);

    renderWithQueryClient(<AlbumList userId={1} onAlbumSelect={jest.fn()} />);

    await waitFor(() => screen.getByText("Album 1"));
    const deleteButton = screen.getAllByText("Delete")[0];

    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(deleteAlbum).toHaveBeenCalledWith(1);
    });
  });

  it("handles album editing", async () => {
    renderWithQueryClient(<AlbumList userId={1} onAlbumSelect={jest.fn()} />);

    await waitFor(() => screen.getByText("Album 1"));
    const editButton = screen.getAllByText("Edit")[0];

    fireEvent.click(editButton);

    const input = screen.getByDisplayValue("Album 1");
    fireEvent.change(input, { target: { value: "Updated Album 1" } });

    expect(input).toHaveValue("Updated Album 1");
  });

  it("handles album selection", async () => {
    const onAlbumSelect = jest.fn();

    renderWithQueryClient(
      <AlbumList userId={1} onAlbumSelect={onAlbumSelect} />
    );

    await waitFor(() => screen.getByText("Album 1"));
    const selectButton = screen.getAllByText("Photos")[0];

    fireEvent.click(selectButton);

    expect(onAlbumSelect).toHaveBeenCalledWith(1, "Album 1");
  });

  it("handles error state", async () => {
    (fetchAlbums as jest.Mock).mockRejectedValueOnce(
      new Error("Network Error")
    );

    renderWithQueryClient(<AlbumList userId={1} onAlbumSelect={jest.fn()} />);

    await waitFor(() => {
      expect(screen.getByText(/Error fetching albums/i)).toBeInTheDocument();
    });
  });
});
