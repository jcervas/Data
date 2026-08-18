# Trump 2025 poll issue questions

This directory contains the data behind "[Americans voted for Trump, but don't support his agenda](https://abcnews.go.com/538/americans-voted-trump-support-agenda/story?id=119136603)" (Feb. 25, 2025). 

`trump-poll-issue-questions.csv` contains data on questions pollsters asked about policies President Donald Trump enacted or proposed, as well as official actions he took as president (e.g., Cabinet nominations), from Jan. 20 to Feb. 24, 2025.

The following columns appear in the dataset. 

| Header | Definition |
| --- | --------------- |
| `question` | Text of the question as asked by the pollster. |
| `category` | An issue category for the question, hand-coded by 538. |
| `yes` | Percentage of respondents indicating they approved/supported/favored the action or policy in question. |
| `no` | Percentage of respondents who disapproved/opposed the action or policy in question. |
| `dates` | Field dates the pollster began and ended interviews for the poll. |
| `pollster` | Pollster that conducted the poll. |
| `link` | URL that leads to the results of the poll. |
| `net` | Difference between the 'yes' column and the 'no' column. |
