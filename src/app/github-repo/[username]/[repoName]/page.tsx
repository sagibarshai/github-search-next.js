import Link from "next/link";
import "./styles.css";

interface Props {
  params: {
    username: string;
    repoName: string;
  };
}

const fetchRepoDetails = async (username: string, repoName: string) => {
  const res = await fetch(`https://api.github.com/repos/${username}/${repoName}`, {
    next: { revalidate: 3600 }, // Cache for 1 hour
  });

  if (!res.ok) return null;
  return res.json();
};

const fetchTopContributors = async (username: string, repoName: string) => {
  const res = await fetch(`https://api.github.com/repos/${username}/${repoName}/contributors?per_page=5`, { next: { revalidate: 86400 } });

  if (!res.ok) return [];
  return res.json();
};

const GithubRepoPage = async ({ params }: Props) => {
  const { username, repoName } = await params;

  const repo = await fetchRepoDetails(username, repoName);

  if (!repo) throw new Error(`Cannot find repo ${repoName} for user ${username}`);

  const contributors = await fetchTopContributors(username, repoName);

  return (
    <div className="container">
      <h1 className="repo-name">{repo.name}</h1>
      <p className="repo-description">{repo.description || "No description available"}</p>
      <p className="repo-info">
        <strong>Language:</strong> {repo.language || "Unknown"}
      </p>
      <p className="repo-info">
        <strong>Stars:</strong> ⭐ {repo.stargazers_count}
      </p>
      <p className="repo-info">
        <strong>Last Updated:</strong> {new Date(repo.updated_at).toLocaleDateString()}
      </p>
      <a href={repo.html_url} target="_blank" rel="noopener noreferrer" className="repo-link">
        View on GitHub 🔗
      </a>

      <div className="contributors-section">
        <h2>Top Contributors</h2>
        {contributors.length > 0 ? (
          <ul className="contributors-list">
            {contributors.map((contributor: any) => (
              <li key={contributor.id} className="contributor-item">
                <img src={contributor.avatar_url} alt={contributor.login} className="contributor-avatar" />
                <a href={contributor.html_url} target="_blank" rel="noopener noreferrer" className="contributor-name">
                  {contributor.login}
                </a>
                <span>({contributor.contributions} commits)</span>
              </li>
            ))}
          </ul>
        ) : (
          <p>No contributors found.</p>
        )}
      </div>

      <Link href="/" className="back-link">
        Back
      </Link>
    </div>
  );
};

export default GithubRepoPage;
