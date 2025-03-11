import "./styles.css";

export interface GithubRepositoryData {
  repoName: string;
  description: string;
  starCount: number;
  programmingLanguage: string;
}

const GithubRepoCard: React.FC<GithubRepositoryData> = ({ description, programmingLanguage, repoName, starCount }) => {
  return (
    <div className="github-repo-card-wrapper">
      <div className="github-repo-content">
        <h5 className="github-repo-card-title ellipsis">{repoName}</h5>
        <p className="github-repo-card-description ellipsis">{description}</p>
        <div className="github-repo-card-footer-row">
          <span className="github-repo-card-span ellipsis">⭐{starCount}</span>
          <span className="github-repo-card-span ellipsis">{programmingLanguage}</span>
        </div>
      </div>
    </div>
  );
};

export default GithubRepoCard;
