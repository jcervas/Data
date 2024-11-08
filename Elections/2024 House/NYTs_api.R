# Use this script to get up-to-date Congressional Election results for 2024 from the NYTs.

# Load required packages
library(httr)
library(jsonlite)

# Read the JSON data
response <- GET(url = "https://static01.nyt.com/elections-assets/pages/data/2024-11-05/results-house.json")
json_data <- fromJSON(content(response, "text"))

# Extract the main list of races
races <- json_data$races
seats <- seq_along(races)

# Initialize a data frame to store combined district and candidate information
election_results <- data.frame()

# Loop through each race to extract relevant information
for (i in seats) {
  
  # Access the candidate metadata list
  candidate_metadata <- races[[i]]$candidate_metadata
  
  # Initialize empty vectors to store party names and candidate names
  party_names <- candidate_names <- c()
  
  # Loop over each candidate in the candidate_metadata list
  for (candidate_id in names(candidate_metadata)) {
    # Extract and check for NULL in party name and candidate name
    party_name <- ifelse(is.null(candidate_metadata[[candidate_id]]$party$name), "NA", candidate_metadata[[candidate_id]]$party$name)
    candidate_name <- ifelse(is.null(candidate_metadata[[candidate_id]]$last_name), "NA", candidate_metadata[[candidate_id]]$last_name)
    
    # Append the party name and candidate name to the vectors
    party_names <- c(party_names, party_name)
    candidate_names <- c(candidate_names, candidate_name)
  }
  
  # General district-level info
  district <- ifelse(is.null(races[[i]]$seat), "NA", races[[i]]$seat)
  url <- ifelse(is.null(races[[i]]$url), "NA", races[[i]]$url)
  election_date <- ifelse(is.null(races[[i]]$election_date), "NA", races[[i]]$election_date)
  state <- ifelse(is.null(races[[i]]$reporting_units[[1]]$state_postal), "NA", races[[i]]$reporting_units[[1]]$state_postal)
  total_votes <- ifelse(is.null(races[[i]]$reporting_units[[1]]$total_votes), "NA", races[[i]]$reporting_units[[1]]$total_votes)
  votes_counted <- ifelse(is.null(races[[i]]$reporting_units[[1]]$eevp), "NA", races[[i]]$reporting_units[[1]]$eevp)
  
  # Loop through candidates within each district
  candidates <- races[[i]]$reporting_units[[1]]$candidates
  for (j in seq_along(candidates)) {
    candidate <- candidates[[j]]
    candidate_id <- ifelse(is.null(candidate$nyt_id), "NA", candidate$nyt_id)
    votes <- ifelse(is.null(candidate$votes$total), "NA", candidate$votes$total)
    leader <- ifelse(is.null(candidate$leader), "NA", candidate$leader)
    
    # Add row to election_results
    election_results <- rbind(election_results, data.frame(
      State = state,
      District = district,
      ElectionDate = election_date,
      TotalVotes = total_votes,
      Name = candidate_names[j],
      CandidateID = candidate_id,
      CandidateParty = party_names[j],
      Votes = votes,
      Leader = leader,
      VotesCounted = votes_counted
    ))
  }
}

# View the combined data frame
print(head(election_results))

####

# Get unique combinations of State and District
unique_districts <- unique(election_results[, c("State", "District")])

# Initialize a data frame to store results by State and District with Democrat, Republican, and Other votes
election_results_party_wide <- data.frame()

# Loop through each unique combination of State and District
for (i in 1:nrow(unique_districts)) {
  # Extract the current State and District
  state <- unique_districts$State[i]
  district <- unique_districts$District[i]
  
  # Filter data for each State/District
  sd_data <- subset(election_results, State == state & District == district)
  
  # Calculate total votes for each party
  party_totals <- tapply(sd_data$Votes, sd_data$CandidateParty, sum, na.rm = TRUE)
  
  # Separate Democrat, Republican, and Other votes
  democrat_votes <- ifelse("Democrat" %in% names(party_totals), party_totals["Democrat"], 0)
  republican_votes <- ifelse("Republican" %in% names(party_totals), party_totals["Republican"], 0)
  other_votes <- sum(party_totals[!names(party_totals) %in% c("Democrat", "Republican")], na.rm = TRUE)
  
  # Prepare a row with State, District, and total votes for Democrat, Republican, and Other
  wide_row <- data.frame(
    State = state,
    District = district,
    ElectionDate = unique(sd_data$ElectionDate),
    TotalVotes = unique(sd_data$TotalVotes),
    VotesCounted = unique(sd_data$VotesCounted),
    Democrat_Votes = democrat_votes,
    Republican_Votes = republican_votes,
    Other_Votes = other_votes
  )
  
  # Bind the row to the wide results
  election_results_party_wide <- rbind(election_results_party_wide, wide_row)
}

# View the wide-format data frame
print(head(election_results_party_wide))


write.csv(election_results, '/Users/cervas/Library/CloudStorage/GoogleDrive-jcervas@andrew.cmu.edu/My Drive/GitHub/Data/Elections/2024 House/USHouse2024.csv', row.names=F)
write.csv(election_results_party_wide, '/Users/cervas/Library/CloudStorage/GoogleDrive-jcervas@andrew.cmu.edu/My Drive/GitHub/Data/Elections/2024 House/USHouse2024_wide.csv', row.names=F)


