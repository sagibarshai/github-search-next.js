"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import SearchInput, { SearchInputProps } from "./components/inputs/search";
import "./styles.css";
import { useRouter } from "next/navigation";
import { useDebounce } from "./hooks/use-debounce";
import GithubRepoCard, { GithubRepositoryData } from "./components/github-card";
import PrimaryButton from "./components/buttons/primary";

type GithubRepositoryResponse = {
  id: number;
  node_id: string;
  name: string;
  full_name: string;
  private: boolean;
  owner: {
    login: string;
    id: number;
    node_id: string;
    avatar_url: string;
    gravatar_id: string;
    url: string;
    html_url: string;
    followers_url: string;
    following_url: string;
    gists_url: string;
    starred_url: string;
    subscriptions_url: string;
    organizations_url: string;
    repos_url: string;
    events_url: string;
    received_events_url: string;
    type: string;
    user_view_type: string;
    site_admin: boolean;
  };
  html_url: string;
  description: string | null;
  fork: boolean;
  url: string;
  forks_url: string;
  keys_url: string;
  collaborators_url: string;
  teams_url: string;
  hooks_url: string;
  issue_events_url: string;
  events_url: string;
  assignees_url: string;
  branches_url: string;
  tags_url: string;
  blobs_url: string;
  git_tags_url: string;
  git_refs_url: string;
  trees_url: string;
  statuses_url: string;
  languages_url: string;
  stargazers_url: string;
  contributors_url: string;
  subscribers_url: string;
  subscription_url: string;
  commits_url: string;
  git_commits_url: string;
  comments_url: string;
  issue_comment_url: string;
  contents_url: string;
  compare_url: string;
  merges_url: string;
  archive_url: string;
  downloads_url: string;
  issues_url: string;
  pulls_url: string;
  milestones_url: string;
  notifications_url: string;
  labels_url: string;
  releases_url: string;
  deployments_url: string;
  created_at: string;
  updated_at: string;
  pushed_at: string;
  git_url: string;
  ssh_url: string;
  clone_url: string;
  svn_url: string;
  homepage: string | null;
  size: number;
  stargazers_count: number;
  watchers_count: number;
  language: string;
  has_issues: boolean;
  has_projects: boolean;
  has_downloads: boolean;
  has_wiki: boolean;
  has_pages: boolean;
  has_discussions: boolean;
  forks_count: number;
  mirror_url: string | null;
  archived: boolean;
  disabled: boolean;
  open_issues_count: number;
  license: string | null;
  allow_forking: boolean;
  is_template: boolean;
  web_commit_signoff_required: boolean;
  topics: string[];
  visibility: string;
  forks: number;
  open_issues: number;
  watchers: number;
  default_branch: string;
}[];

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
          const data = (await response.json()) as GithubRepositoryResponse;
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
