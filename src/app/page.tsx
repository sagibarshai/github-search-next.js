"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import SearchInput, { SearchInputProps } from "./components/inputs/search";
import "./styles.css";
import { useRouter } from "next/navigation";
import { useDebounce } from "./hooks/use-debounce";
import GithubRepoCard, { GithubRepositoryData } from "./components/github-card";
import PrimaryButton from "./components/buttons/primary";
import { RepoDetails } from "./github-repo/[username]/[repoName]/page";

const HomePage: React.FC = () => {
  const router = useRouter();

  // repos
  const [repos, setRepos] = useState<GithubRepositoryData[]>([]);
  const [isSorted, setIsSorted] = useState<boolean>(false);

  // search input
  const onSearchInputChange = (value: string) => {
    setSearchInputState((prev) => ({
      ...prev,
      isValid: value.length > 1,
      errorMessage: "Please type at least two characters",
      showError: true,
      value,
    }));
  };

  const [searchInputState, setSearchInputState] = useState<SearchInputProps["state"]>({
    errorMessage: "Please type at least two characters",
    isValid: false,
    showError: false,
    value: "",
  });
  const searchInputStatics: SearchInputProps["statics"] = useMemo(() => {
    return {
      label: "Username",
      placeHolder: "Type username here...",
      onChange: onSearchInputChange,
    };
  }, []);

  const debounceValue = useDebounce({ value: searchInputState.isValid ? searchInputState.value : "", delay: 300 });

  useEffect(() => {
    if (debounceValue) {
      const fetchData = async () => {
        try {
          const response = await fetch(`https://api.github.com/users/${debounceValue}/repos`);
          const data = (await response.json()) as RepoDetails[];
          const mappedData: GithubRepositoryData[] = data.map((item) => ({
            repoName: item.name,
            description: item.description || "No description",
            starCount: item.stargazers_count,
            programmingLanguage: item.language || "Unknown",
          }));
          setRepos(mappedData);
        } catch (err) {
          setRepos([]);
        } finally {
          setIsSorted(false);
        }
      };
      fetchData();
    }
  }, [debounceValue]);

  const handleNavigate = useCallback((username: string, repoName: string) => {
    router.push(`/github-repo/${username}/${repoName}`);
  }, []);

  const sortByStars = useCallback((repos: GithubRepositoryData[], type: "Descending" | "Ascending" = "Descending") => {
    const sorted = [...repos].sort((a, b) => (type === "Descending" ? b.starCount - a.starCount : a.starCount - b.starCount));
    setIsSorted(true);
    setRepos(sorted);
  }, []);

  return (
    <form className="root-page-wrapper">
      <div className="root-page-content">
        <h1 className="root-title">GitHub Repo Explorer</h1>
        <h6 className="root-subtitle">Enter a GitHub username to explore repositories</h6>
        <SearchInput statics={searchInputStatics} state={searchInputState} />
        <PrimaryButton disabled={isSorted} onClick={() => sortByStars(repos)}>
          Sort by stars
        </PrimaryButton>
        <div className="root-page-repos-grid-wrapper">
          {repos.length ? (
            repos.map((repo) => (
              <div onClick={() => handleNavigate(searchInputState.value, repo.repoName)}>
                <GithubRepoCard key={repo.repoName} {...repo} />
              </div>
            ))
          ) : (
            <div className="root-no-results">{searchInputState.value && searchInputState.isValid ? "No results" : null}</div>
          )}
        </div>
      </div>
    </form>
  );
};
export default HomePage;
