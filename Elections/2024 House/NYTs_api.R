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
  
  # Create a lookup table for candidate metadata
  metadata_lookup <- list()
  for (candidate_id in names(candidate_metadata)) {
    current_candidate <- candidate_metadata[[candidate_id]]
    metadata_lookup[[candidate_id]] <- list(
      party_name = ifelse(is.null(current_candidate$party$name), 
                         "NA", 
                         current_candidate$party$name),
      candidate_name = ifelse(is.null(current_candidate$last_name), 
                            "NA", 
                            current_candidate$last_name)
    )
  }
  
  # General district-level info
  district <- ifelse(is.null(races[[i]]$seat), "NA", races[[i]]$seat)
  url <- ifelse(is.null(races[[i]]$url), "NA", races[[i]]$url)
  election_date <- ifelse(is.null(races[[i]]$election_date), "NA", races[[i]]$election_date)
  state <- ifelse(is.null(races[[i]]$reporting_units[[1]]$state_postal), 
                 "NA", 
                 races[[i]]$reporting_units[[1]]$state_postal)
  total_votes <- ifelse(is.null(races[[i]]$reporting_units[[1]]$total_votes), 
                       "NA", 
                       races[[i]]$reporting_units[[1]]$total_votes)
  # votes_counted <- ifelse(is.null(races[[i]]$reporting_units[[1]]$eevp), 
  #                        "NA", 
  #                        races[[i]]$reporting_units[[1]]$eevp)


  votes_remaining <- ifelse(is.null(races[[i]]$reporting_units[[1]]$total_expected_vote), 
                         "NA", 
                         races[[i]]$reporting_units[[1]]$total_expected_vote)
  votes_total <- ifelse(is.null(races[[i]]$reporting_units[[1]]$total_votes) || races[[i]]$reporting_units[[1]]$total_votes %in% 0, 
                         "NA", 
                         races[[i]]$reporting_units[[1]]$total_votes)
  PercentReported <- ifelse(is.null(votes_total) || votes_remaining %in% "NA", "NA", round(votes_total/votes_remaining, d=3) * 100)
  
  # Loop through candidates within each district
  candidates <- races[[i]]$reporting_units[[1]]$candidates
  for (j in seq_along(candidates)) {
    candidate <- candidates[[j]]
    candidate_id <- candidate$nyt_id
    
    # Look up the metadata using the candidate's nyt_id
    metadata <- metadata_lookup[[candidate_id]]
    if (is.null(metadata)) {
      # If no metadata found, use NA values
      candidate_name <- "NA"
      party_name <- "NA"
    } else {
      candidate_name <- metadata$candidate_name
      party_name <- metadata$party_name
    }
    
    votes <- ifelse(is.null(candidate$votes$total), "NA", candidate$votes$total)
    leader <- ifelse(is.null(candidate$leader), "NA", candidate$leader)
    
    race_results <- data.frame(
      State = state,
      District = district,
      ElectionDate = election_date,
      TotalVotes = total_votes,
      Name = candidate_name,
      CandidateID = candidate_id,
      CandidateParty = party_name,
      Votes = votes,
      Leader = leader,
      VotesCounted = votes_total,
      VotesRemaining = votes_remaining,
      PercentReported = PercentReported,
      stringsAsFactors = FALSE
    )
    
    # Add row to election_results
    election_results <- rbind(election_results, race_results)
  }
}

# View the first few rows to verify the party information
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


