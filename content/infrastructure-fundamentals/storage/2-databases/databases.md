+++
title = "Databases"
weight = 2
date = 2024-11-19
draft = false
+++

[Watch the presentation]({{< relref "databases-slides.md" >}})

[Se presentationen på svenska]({{< relref "databases-slides-swe.md" >}})

Applications that serve multiple users must store data persistently and make it available for retrieval. The **database** provides this capability, organizing information in structured formats that support efficient querying, concurrent access, and reliable updates. Understanding database types and their characteristics enables selecting the right storage solution for specific application requirements.

## What Makes a Database

A database differs from simple file storage through several fundamental capabilities. These characteristics transform raw storage into a system that can handle complex data operations reliably.

### Structured Organization

Databases impose structure on data. Rather than storing information as unorganized files, databases organize data in tables, documents, key-value pairs, or graphs. This structure enables efficient queries—finding specific records without scanning every piece of stored data.

The structure varies by database type. Relational databases organize data into tables with defined columns and relationships. Document databases store semi-structured data as JSON or XML. Key-value stores treat data as opaque values indexed by keys. Each model suits different access patterns and data relationships.

### Data Integrity

Databases enforce rules about what data can be stored and how it relates. **Constraints** prevent invalid data—a user email must be unique, a foreign key must reference an existing record, a numeric field cannot contain text. **Transactions** group multiple operations into atomic units that either complete fully or fail entirely, preventing partial updates that leave data inconsistent.

These mechanisms ensure reliability. When an application transfers money between accounts, the transaction ensures both the debit and credit occur—or neither does. The database maintains consistent state even when multiple clients access data simultaneously.

### Concurrent Access

Multiple users and applications query and modify database data simultaneously. Databases manage this concurrency, ensuring that one user's changes do not corrupt another user's operations. **Isolation** mechanisms prevent users from seeing partial updates. **Locking** controls which transactions can modify data at the same time.

Without proper concurrency control, database operations would interfere with each other. Two users editing the same record could overwrite each other's changes. A report generated during data updates could show inconsistent results. Databases prevent these conflicts while maintaining performance.

### Query Capabilities

Databases provide specialized languages for data manipulation. **SQL** (Structured Query Language) dominates relational databases, offering expressive syntax for filtering, joining, aggregating, and transforming data. NoSQL databases use API-based queries, each optimized for their specific data model.

Query optimization matters. Databases analyze queries to determine the most efficient execution plan, using indexes to avoid scanning entire tables. A well-indexed database returns results in milliseconds even with millions of records.

### Durability and Backup

Once data is committed to a database, it persists even if the system crashes. Databases write changes to persistent storage and maintain transaction logs that enable recovery after failures. **Backup** mechanisms create point-in-time copies that protect against data loss.

This durability distinguishes databases from in-memory caches or temporary storage. Applications rely on databases to preserve critical information—user accounts, financial transactions, application state—across restarts, crashes, and hardware failures.

## Database Categories

Different database types optimize for different workloads. The category choice affects application design, performance characteristics, and operational requirements.

### Relational Databases

**Relational databases** organize data into tables with rows representing records and columns representing attributes. Relationships between tables use **foreign keys**—a column in one table that references the primary key of another table.

The relational model enforces structure. Each table has a defined schema specifying column names, data types, and constraints. Queries join tables to retrieve related data. Transactions ensure that operations spanning multiple tables maintain consistency.

Common relational databases include PostgreSQL, MySQL, Microsoft SQL Server, and Oracle. These databases excel at structured data with complex relationships. Financial systems, customer relationship management, inventory tracking, and other applications requiring strong consistency benefit from the relational model.

The trade-off is rigidity. Schema changes require explicit migrations that alter table structure. Adding new data fields means modifying the schema, which can be disruptive for rapidly evolving applications.

### NoSQL Databases

**NoSQL databases** (meaning "not only SQL") provide flexible data storage that deviates from rigid table structures. They support various data models:

**Document databases** store semi-structured data as JSON, XML, or similar formats. Each document contains fields that can vary between records. MongoDB and Couchbase implement this model.

**Key-value stores** treat data as opaque values indexed by unique keys. This simple model enables extremely fast lookups. Redis and Amazon DynamoDB use key-value storage.

**Column-family databases** organize data into column families rather than rows. This structure optimizes for queries that access specific columns across many records. Cassandra and HBase follow this model.

**Graph databases** represent data as nodes and edges, optimizing for queries that traverse relationships. Neo4j and Amazon Neptune specialize in graph data.

NoSQL databases typically sacrifice some consistency guarantees for improved scalability and flexibility. They suit applications with variable data structures, massive scale requirements, or workloads that do not require complex transactions. Social media platforms, content management systems, and IoT data collection use NoSQL databases.

### In-Memory Databases

**In-memory databases** store data in RAM rather than on disk. This architecture eliminates disk I/O latency, enabling microsecond response times. Redis and Memcached implement in-memory storage.

The speed advantage makes in-memory databases ideal for caching frequently accessed data, session management, real-time analytics, and leaderboards. Applications query the in-memory database first, only accessing slower disk-based storage for cache misses.

The constraint is volatility and cost. RAM loses data when power fails, so in-memory databases either accept data loss (for caches) or implement persistence mechanisms that write to disk periodically. RAM also costs more per gigabyte than disk storage, limiting practical database sizes.

### Time Series Databases

**Time series databases** optimize for data indexed by timestamp. Each record includes a time component, and queries typically retrieve ranges of time-stamped data or perform temporal aggregations.

InfluxDB and TimescaleDB specialize in time series workloads. These databases compress time-ordered data efficiently and optimize queries that analyze changes over time.

IoT sensor networks, application performance monitoring, financial tick data, and infrastructure metrics all generate time series data. Time series databases handle the high write rates and large volumes these applications produce while supporting the analytical queries they require.

### Data Warehouses

**Data warehouses** aggregate data from multiple sources to support analytical queries and business intelligence. Rather than handling transactional workloads, they optimize for complex queries that scan large datasets.

Amazon Redshift, Google BigQuery, and Snowflake provide managed data warehouse services. These systems use columnar storage, distributed query processing, and specialized optimizations to analyze terabytes of data quickly.

Data warehouses suit reporting, business analytics, and decision support systems. Organizations extract data from operational databases, transform it for analytical use, and load it into the warehouse. Analysts then query the warehouse without impacting production systems.

## Database Concepts

Several theoretical frameworks explain database behavior and guide design decisions.

### ACID Properties

**ACID** describes the properties that ensure reliable transaction processing in relational databases:

**Atomicity** guarantees that transactions complete entirely or not at all. If any operation within a transaction fails, the entire transaction rolls back, leaving no partial changes.

**Consistency** ensures that transactions move the database from one valid state to another. Constraints and rules defined on the database are enforced across transaction boundaries.

**Isolation** means that concurrent transactions do not interfere with each other. Each transaction operates as if it were the only transaction executing, even when many run simultaneously.

**Durability** guarantees that committed transactions persist even if the system crashes immediately after the commit. Once a transaction succeeds, its changes are permanent.

These properties matter for applications requiring strong consistency guarantees. Financial transactions, inventory management, and other systems where incorrect data causes real-world consequences rely on ACID compliance.

### CAP Theorem

The **CAP theorem** describes trade-offs in distributed databases. The theorem states that a distributed system can provide at most two of three guarantees:

**Consistency** means every read receives the most recent write. All nodes see the same data simultaneously.

**Availability** means every request receives a response, though it may not contain the most recent data.

**Partition tolerance** means the system continues operating despite network failures that prevent some nodes from communicating with others.

Network partitions are inevitable in distributed systems, so practical databases must be partition-tolerant. This forces a choice between consistency and availability. Traditional relational databases often prioritize consistency (CP), sacrificing availability during network issues. Many NoSQL databases prioritize availability (AP), accepting temporary inconsistency.

The choice affects application behavior. A CP system might refuse requests during network problems to avoid serving stale data. An AP system always responds but might return outdated information. Understanding these trade-offs guides database selection for distributed architectures.

### Sharding and Partitioning

**Partitioning** divides a database into smaller, independent pieces to improve performance and manageability. Different partitioning strategies suit different access patterns:

**Horizontal partitioning** (or **sharding**) splits tables by rows. User records might be partitioned by geographic region, with European users in one shard and American users in another. Each shard contains a subset of the total rows but maintains the same schema.

**Vertical partitioning** splits tables by columns. Frequently accessed columns might be separated from rarely used ones, reducing the data each query must scan.

Partitioning enables databases to scale beyond single-server capacity. Queries can execute against specific partitions rather than scanning the entire dataset. Write operations distribute across partitions, reducing contention.

The challenge is partition key selection. The key determines which partition stores each record. A poor partition key leads to unbalanced partitions—some overloaded while others sit idle. Queries that span multiple partitions lose performance benefits.

## Cloud Database Services

Cloud platforms provide managed database services that handle operational tasks—provisioning, patching, backup, replication—while exposing standard database interfaces.

### Azure Database Services

Azure offers managed versions of popular databases:

**Azure SQL Database** provides a managed Microsoft SQL Server instance with automatic backups, scaling, and high availability.

**Azure Database for PostgreSQL** delivers managed PostgreSQL with similar operational benefits. This service suits applications using PostgreSQL in the IPL25 course.

**Azure Database for MySQL** provides managed MySQL instances.

**Azure Cosmos DB** offers a globally distributed NoSQL database supporting multiple data models (document, key-value, column-family, graph) with configurable consistency levels.

These services reduce operational overhead. The platform handles hardware failures, software updates, and backup management. Applications connect using standard database protocols, making migration from self-managed databases straightforward.

### Trade-offs of Managed Services

Managed database services sacrifice some control for operational simplicity. Configuration options may be more limited than self-managed installations. Performance tuning that requires OS-level access becomes impossible. Costs follow consumption pricing rather than fixed hardware expenses.

For applications prioritizing feature development over infrastructure management, these trade-offs often make sense. The time saved on database administration enables focus on application logic and user needs.

## Selecting a Database

Database selection depends on several factors:

**Data structure and relationships**: Highly structured data with complex relationships suits relational databases. Variable structure or simple relationships work well with NoSQL options.

**Consistency requirements**: Applications requiring immediate consistency across all operations need ACID-compliant relational databases. Applications that can tolerate eventual consistency gain flexibility with NoSQL alternatives.

**Query patterns**: Analytical queries across large datasets suit columnar databases or data warehouses. Transactional workloads with point queries suit relational or key-value databases.

**Scale requirements**: Applications expecting massive scale or geographic distribution benefit from NoSQL databases designed for horizontal scaling. Smaller-scale applications with complex queries may prefer relational databases.

**Operational capacity**: Teams with database administration expertise can manage self-hosted installations. Smaller teams benefit from managed services that handle operational complexity.

For the IPL25 course projects, PostgreSQL provides a solid foundation. It offers relational structure suitable for application data, ACID compliance for data integrity, and widespread adoption in Python ecosystems. Azure's managed PostgreSQL service handles operational concerns while providing familiar SQL interfaces.

## Summary

Databases provide structured, reliable storage for application data. The database category—relational, NoSQL, in-memory, time series, or data warehouse—determines performance characteristics, consistency guarantees, and operational requirements. Understanding these options and the concepts behind them enables matching storage architecture to application needs.
