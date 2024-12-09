Roxiler Backend Task
Overview
This backend application fetches product transaction data from a third-party API, initializes a database with the data, and provides APIs for listing transactions and generating statistics for a selected month.

API Features
Initialize Database: Fetch and store data from Third-Party API.
List Transactions:
Supports search by title, description, or price.
Includes pagination (default: page = 1, per page = 10).
Statistics API:
Total sale amount for the selected month.
Total number of sold and unsold items for the selected month.
