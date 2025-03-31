## Who's Faster

Who's Faster is a simple Arabic type racer game, where you get to compete with others at typing in Arabic. You can check it out at [game.noura.website](https://game.noura.website).

## Installation

### Step 1: Clone the Repository

```bash
git clone https://github.com/nouraalfr/whos-faster.git
cd whos-faster
```

### Step 2: Set Up Environment Variables

Modify your environment variables in Docker Compose:

```env
DB_HOST=db
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=game
SESSION_KEY=your_secret_key

# MySQL container configuration
MYSQL_ALLOW_EMPTY_PASSWORD: true
MYSQL_DATABASE: game
```

> **Note:** If you choose to use a MySQL password instead of an empty password, replace `MYSQL_ALLOW_EMPTY_PASSWORD: true` with `MYSQL_ROOT_PASSWORD: your_mysql_password`. Ensure that `DB_PASSWORD` matches `your_mysql_password`.

### Step 3: Build and Run with Docker Compose

Run the following command to build and start the containers:

```bash
docker-compose up --build
```
