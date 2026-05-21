"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@codegouvfr/react-dsfr/Input";
import { fr } from "@codegouvfr/react-dsfr";

interface SearchResult {
  id: number;
  firstName: string;
  lastName: string;
  administration: string;
  role: string | null;
}

export function SearchBar(): React.ReactElement {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const listboxId = "search-results-listbox";

  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    const controller = new AbortController();
    const timeout = setTimeout(async () => {
      try {
        const response = await fetch(
          `/api/contacts/search?q=${encodeURIComponent(query)}`,
          { signal: controller.signal },
        );
        if (response.ok) {
          const data = (await response.json()) as SearchResult[];
          setResults(data);
          setIsOpen(data.length > 0);
          setActiveIndex(-1);
        }
      } catch {
        // Aborted or network error — ignore
      }
    }, 200);

    return () => {
      clearTimeout(timeout);
      controller.abort();
    };
  }, [query]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent): void {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function navigateToContact(id: number): void {
    setIsOpen(false);
    setQuery("");
    router.push(`/contacts/${id}`);
  }

  function handleKeyDown(event: React.KeyboardEvent): void {
    if (!isOpen || results.length === 0) return;

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((prev) => (prev < results.length - 1 ? prev + 1 : 0));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((prev) => (prev > 0 ? prev - 1 : results.length - 1));
    } else if (event.key === "Enter" && activeIndex >= 0) {
      event.preventDefault();
      const result = results[activeIndex];
      if (result) navigateToContact(result.id);
    } else if (event.key === "Escape") {
      setIsOpen(false);
    }
  }

  return (
    <div ref={containerRef} style={{ position: "relative" }}>
      <Input
        label="Rechercher un interlocuteur"
        hintText="Tapez un nom, prénom ou administration"
        iconId="fr-icon-search-line"
        nativeInputProps={{
          value: query,
          onChange: (e) => setQuery(e.target.value),
          onKeyDown: handleKeyDown,
          onFocus: () => { if (results.length > 0) setIsOpen(true); },
          role: "combobox",
          "aria-expanded": isOpen,
          "aria-controls": listboxId,
          "aria-activedescendant": activeIndex >= 0 ? `search-result-${activeIndex}` : undefined,
          "aria-autocomplete": "list",
          autoComplete: "off",
        }}
      />
      {isOpen && (
        <ul
          id={listboxId}
          role="listbox"
          className={fr.cx("fr-p-0")}
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            zIndex: 1000,
            listStyle: "none",
            margin: 0,
            background: "var(--background-default-grey)",
            border: "1px solid var(--border-default-grey)",
            borderTop: "none",
            maxHeight: "300px",
            overflowY: "auto",
          }}
        >
          {results.map((result, index) => (
            <li
              key={result.id}
              id={`search-result-${index}`}
              role="option"
              aria-selected={index === activeIndex}
              className={fr.cx("fr-p-2w")}
              style={{
                cursor: "pointer",
                background: index === activeIndex
                  ? "var(--background-active-blue-france)"
                  : "transparent",
                color: index === activeIndex
                  ? "var(--text-inverted-blue-france)"
                  : "inherit",
              }}
              onMouseDown={() => navigateToContact(result.id)}
              onMouseEnter={() => setActiveIndex(index)}
            >
              <strong>
                {result.firstName} {result.lastName}
              </strong>
              <br />
              <span className={fr.cx("fr-text--sm")}>
                {result.administration}
                {result.role ? ` — ${result.role}` : ""}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
