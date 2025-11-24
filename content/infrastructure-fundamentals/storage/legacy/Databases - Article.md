+++
title = "Databases"
weight = 2
date = 2024-11-19
draft = false
hidden = true
+++

[Watch the presentation]({{< relref "databases-slides.md" >}})

[Se presentationen på svenska]({{< relref "databases-slides-swe.md" >}})

<!-- # Databases -->

A **database** is a structured collection of data stored and organized to facilitate easy access, retrieval, and management. Databases are crucial to the operation of almost all digital systems, from websites and mobile apps to complex business applications and enterprise software. They provide a reliable way to store vast amounts of data while supporting efficient processing and analysis, enabling organizations to handle transactions, generate reports, and make informed decisions.

## Key Characteristics of Databases

Databases share several essential features that make them powerful tools for managing data:

**Data Structure**: Databases organize data in structured formats, such as tables, documents, key-value pairs, or graphs, which allow for efficient querying and data handling.

**Data Integrity**: A core aspect of databases is maintaining data accuracy and consistency. This is achieved through mechanisms like **constraints**, **triggers**, and **transactions**, ensuring reliable and error-free data management.

**Scalability**: Modern databases can scale vertically (by adding more resources such as CPU and memory to a single server) or horizontally (by distributing data across multiple servers) to handle growing workloads and data volumes.

**Query Capabilities**: Databases provide robust querying abilities using languages like **SQL** (Structured Query Language) for relational databases and **API-based queries** for NoSQL databases, facilitating data retrieval and manipulation.

**Security**: Databases include features such as **authentication**, **authorization**, and **encryption** to protect data and ensure that only authorized users have access to sensitive information.

## Types of Databases

**Relational Databases:** Relational databases store data in tables (also called relations), with rows representing individual records and columns representing attributes of the data. Relationships between tables are established using foreign keys.
- **Examples**: **MySQL**, **PostgreSQL**, **Microsoft SQL Server**, **Oracle**.
- **Use Case**: Relational databases are ideal for applications requiring structured data, complex queries, and transactions, such as e-commerce platforms, CRM systems, and financial software.

**NoSQL Databases**: NoSQL databases offer flexible data storage options that deviate from the rigid table structures of relational databases. They support various data models, such as document, key-value, column-family, and graph.
- **Examples**: **MongoDB**, **Cassandra**, **Redis**, **Amazon DynamoDB**.
- **Use Case**: NoSQL databases are used for handling unstructured or semi-structured data, such as social media content, big data, and real-time analytics, where scalability and flexibility are key.

**In-Memory Databases**: These databases store data in RAM rather than on disk, enabling extremely fast data retrieval and processing. They are often used for caching, real-time analytics, and session management.
- **Examples**: **Redis**, **Memcached**.
- **Use Case**: Ideal for applications requiring low-latency access to data, such as real-time financial transactions, leaderboards in gaming, and caching frequently accessed data.

**Time Series Databases**: Optimized for handling time-stamped data, time series databases are commonly used for tracking and analyzing data that changes over time, such as sensor readings or performance metrics.
- **Examples**: **InfluxDB**, **TimescaleDB**.
- **Use Case**: Time series databases are ideal for IoT applications, monitoring systems, and any system that collects data over time.

**Graph Databases**: These databases are designed to store and query data in the form of nodes (entities) and edges (relationships), making them ideal for applications that need to analyze complex connections.
- **Examples**: **Neo4j**, **Amazon Neptune**.
- **Use Case**: Graph databases are well-suited for social networks, recommendation engines, and fraud detection systems, where relationships between data are key.

**Data Warehouses**: Specialized for analytics and reporting, data warehouses aggregate data from various sources to support business intelligence and decision-making.
- **Examples**: **Amazon Redshift**, **Google BigQuery**, **Snowflake**.
- **Use Case**: Data warehouses are used to analyze large datasets, typically in enterprise environments for reporting, business intelligence, and data analysis.

## Key Database Concepts

**ACID Properties**

**ACID** stands for **Atomicity**, **Consistency**, **Isolation**, and **Durability**. These are the key properties that ensure transactions are processed reliably in relational databases.

 - **Atomicity**: Ensures that a transaction is completed fully or not at all.
 - **Consistency**: Guarantees that a transaction brings the database from one valid state to another.
 - **Isolation**: Transactions are independent of each other, maintaining data integrity.
 - **Durability**: Once a transaction is committed, it remains in the database even if the system crashes.

**CAP Theorem**

The **CAP Theorem** explains the trade-offs between **Consistency**, **Availability**, and **Partition Tolerance** in distributed databases. According to this theorem, it is impossible to achieve all three simultaneously, and databases must prioritize two:

 - **Consistency**: Every read receives the most recent write.
 - **Availability**: Every request receives a response, even if it's not the most recent data.
 - **Partition Tolerance**: The system continues to function despite network failures.
   
 NoSQL databases often prioritize **availability** and **partition tolerance** (AP), while relational databases prioritize **consistency** and **availability** (CA).

**Sharding and Partitioning**

- **Sharding** is the process of splitting a large database into smaller, more manageable pieces (called shards) across multiple servers. This helps improve performance and scalability.
- **Partitioning** is a technique used to divide a database into smaller, more efficient sections, making queries faster and reducing server load.

## Cloud Databases

Cloud-based databases provide traditional database functionalities with the added advantages of cloud infrastructure. They are scalable, managed services that often include automated backups, scaling options, and built-in security.

- **AWS**:
  - **RDS (Relational Database Service)**: Managed relational databases such as MySQL and PostgreSQL.
  - **DynamoDB**: A fully managed NoSQL database.
  - **Aurora**: A high-performance database compatible with MySQL and PostgreSQL.

- **Azure**:
  - **Azure SQL Database**: A managed relational database service.
  - **Cosmos DB**: A globally distributed NoSQL database supporting multiple data models.
  - **Azure Database for MySQL/PostgreSQL**: Managed versions of popular open-source relational databases.

- **Google Cloud**:
  - **Cloud SQL**: Managed databases for MySQL, PostgreSQL, and SQL Server.
  - **Bigtable**: A NoSQL database for high-throughput applications.
  - **Spanner**: A globally distributed relational database with strong consistency.

### Conclusion

Databases enable structured data storage and efficient management. Whether for strict consistency with relational databases, scalability and flexibility with NoSQL, or high-speed performance with in-memory solutions, understanding the types of databases and their strengths is key to selecting the right solution for your application needs.