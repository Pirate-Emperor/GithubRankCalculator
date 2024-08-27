function exponential_cdf(x) {
    return 1 - 2 ** -x;
}

function log_normal_cdf(x) {
    return x / (1 + x);
}

function calculateRank({
    all_commits,
    commits,
    prs,
    issues,
    reviews,
    stars,
    followers,
}) {
    const COMMITS_MEDIAN = all_commits ? 1000 : 250,
        COMMITS_WEIGHT = 2;
    const PRS_MEDIAN = 50,
        PRS_WEIGHT = 3;
    const ISSUES_MEDIAN = 25,
        ISSUES_WEIGHT = 1;
    const REVIEWS_MEDIAN = 2,
        REVIEWS_WEIGHT = 1;
    const STARS_MEDIAN = 50,
        STARS_WEIGHT = 4;
    const FOLLOWERS_MEDIAN = 10,
        FOLLOWERS_WEIGHT = 1;

    const TOTAL_WEIGHT =
        COMMITS_WEIGHT +
        PRS_WEIGHT +
        ISSUES_WEIGHT +
        REVIEWS_WEIGHT +
        STARS_WEIGHT +
        FOLLOWERS_WEIGHT;

    const THRESHOLDS = [1, 12.5, 25, 37.5, 50, 62.5, 75, 87.5, 100];
    const LEVELS = ["S", "A+", "A", "A-", "B+", "B", "B-", "C+", "C"];

    const rank =
        1 -
        (COMMITS_WEIGHT * exponential_cdf(commits / COMMITS_MEDIAN) +
            PRS_WEIGHT * exponential_cdf(prs / PRS_MEDIAN) +
            ISSUES_WEIGHT * exponential_cdf(issues / ISSUES_MEDIAN) +
            REVIEWS_WEIGHT * exponential_cdf(reviews / REVIEWS_MEDIAN) +
            STARS_WEIGHT * log_normal_cdf(stars / STARS_MEDIAN) +
            FOLLOWERS_WEIGHT * log_normal_cdf(followers / FOLLOWERS_MEDIAN)) /
        TOTAL_WEIGHT;

    const level = LEVELS[THRESHOLDS.findIndex((t) => rank * 100 <= t)];

    return { level, percentile: rank * 100 };
}

function calculateAndDisplayRank() {
    const commits = Number(document.getElementById('commits').value);
    const prs = Number(document.getElementById('prs').value);
    const issues = Number(document.getElementById('issues').value);
    const reviews = Number(document.getElementById('reviews').value);
    const stars = Number(document.getElementById('stars').value);
    const followers = Number(document.getElementById('followers').value);
    const all_commits = document.getElementById('all_commits').checked;

    const rank = calculateRank({
        all_commits,
        commits,
        prs,
        issues,
        reviews,
        stars,
        followers,
    });

    document.getElementById('result').textContent = `Rank Level: ${rank.level}, Percentile: ${rank.percentile.toFixed(2)}%`;
}
