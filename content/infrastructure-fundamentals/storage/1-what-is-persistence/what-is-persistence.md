+++
title = "What is Persistence"
weight = 1
date = 2024-11-19
draft = false
+++

[Watch the presentation]({{< relref "what-is-persistence-slides.md" >}})

[Se presentationen på svenska]({{< relref "what-is-persistence-slides-swe.md" >}})

Applications that stop running should not lose their data. A user logs out, a server restarts, a process crashes—yet the application must remember user accounts, transaction history, and configuration settings. **Persistence** refers to data that survives beyond the lifespan of the process that created it. Understanding persistence mechanisms enables building applications that maintain state across time.

## Why Persistence Matters

Without persistence, every application restart would reset to its initial state. User registrations would vanish. Shopping carts would empty. Configuration changes would revert. This works for stateless operations—a calculator that performs a computation and exits—but most applications require memory.

Persistence solves this by writing data to **non-volatile storage**: storage media that retains information when power is removed. Hard drives, solid-state drives, and cloud storage services maintain data through power cycles, system crashes, and process terminations. The application writes data to these media, and later instances read that data back.

This capability underpins nearly every application architecture. Web applications store user data in databases. Configuration management tools read settings from files. Log aggregation systems write events to persistent storage for later analysis. The specific mechanism varies, but the principle remains: data must outlive the processes that create it.

## Durability and Availability

Persistence provides two fundamental properties: **durability** and **availability**. These properties determine how reliably data survives failure scenarios.

### Durability

**Durability** means that once data is written, it remains intact through system failures. When an application writes to a database and receives a success confirmation, that data persists even if the database server immediately loses power. The storage system has committed the data to non-volatile media.

Different storage systems provide different durability guarantees. Writing to a local disk provides durability against application crashes but not against disk failure. Writing to a database with transaction logging provides durability against power failures. Writing to cloud storage with geographic replication provides durability against datacenter failures.

These guarantees come with trade-offs. Stronger durability requires more complex write operations—flushing data to disk, replicating to multiple locations, waiting for confirmation before acknowledging success. Applications balance durability requirements against performance needs.

### Availability

**Availability** means that data remains accessible when needed. Durable data that cannot be retrieved serves no purpose. High availability requires redundancy: multiple copies of the data stored in different locations, so that if one storage system fails, another can serve requests.

Cloud storage services typically replicate data across multiple servers and datacenters. Database systems can use read replicas to distribute query load and provide failover capability. File systems can use RAID configurations to maintain access despite individual disk failures.

Availability also involves access patterns. Data stored in archival systems might have high durability but low availability—retrieval takes hours. Data stored in active databases has both high durability and immediate availability. The appropriate level depends on how the application uses the data.

## Storage Systems and Databases

Persistence can be implemented through various technologies, broadly categorized as **storage systems** and **databases**. The distinction lies in how data is organized and accessed.

### Storage Systems

Storage systems provide space for data without imposing structure. The application determines how to organize and interpret the data. Three models dominate:

**Block storage** presents raw storage volumes that operating systems can format and mount. A VM's disk is typically block storage. The storage system manages the physical blocks on disks or SSDs; the filesystem layer (ext4, NTFS, etc.) organizes those blocks into files and directories. Block storage provides low-latency access and suits workloads requiring direct filesystem control.

**File storage** organizes data in a hierarchical structure of directories and files. Network file systems like NFS or SMB allow multiple clients to access shared files. This model suits document storage, shared configuration files, and any scenario where applications expect traditional filesystem semantics. File storage abstracts the underlying block storage and provides a familiar interface.

**Object storage** treats each piece of data as a discrete object with associated metadata. Objects are accessed by unique identifiers through HTTP APIs rather than filesystem paths. Cloud services like Azure Blob Storage provide object storage with high scalability and durability. This model suits unstructured data: images, videos, backups, log archives. Object storage scales to enormous sizes because it does not maintain the hierarchical consistency requirements of filesystems.

### Databases

Databases add structure and access semantics to persistent storage. Rather than storing raw bytes, databases organize data into schemas and provide query languages for retrieval and manipulation.

**Relational databases** organize data into tables with defined columns and data types. Relationships between tables enable complex queries spanning multiple entities. SQL provides a standard language for querying and modifying data. Relational databases enforce integrity constraints—primary keys, foreign keys, unique constraints—ensuring data consistency. PostgreSQL, MySQL, and Microsoft SQL Server exemplify this category.

Transaction support is a key database feature. A **transaction** groups multiple operations into an atomic unit: either all operations succeed, or none do. When transferring money between accounts, the debit and credit must both complete or both fail. Transactions ensure this atomicity. Relational databases typically provide strong transaction guarantees.

**NoSQL databases** encompass various data models—document stores, key-value stores, wide-column stores, graph databases—optimized for different access patterns. These databases often trade strict consistency for higher scalability or more flexible schemas. A document database like MongoDB stores JSON-like documents; a key-value store like Redis provides fast access by exact key matches. NoSQL databases suit workloads where relational constraints are unnecessary and where horizontal scaling across many servers is essential.

## Choosing a Persistence Approach

The appropriate persistence mechanism depends on data characteristics and access patterns:

**Data structure**: Highly structured data with complex relationships fits relational databases. Loosely structured or variable schema data suits document stores or object storage.

**Access patterns**: Applications querying across multiple entities benefit from SQL databases. Applications retrieving complete objects by identifier can use key-value stores or object storage more efficiently.

**Consistency requirements**: Financial applications requiring strict consistency use relational databases with strong transaction guarantees. Eventually-consistent data—user preferences, content caches—can tolerate the weaker guarantees of some NoSQL systems.

**Scale characteristics**: Workloads that fit on a single large server can use traditional relational databases. Workloads requiring distribution across many servers may need horizontally-scalable NoSQL databases or object storage.

**Performance requirements**: Low-latency access to frequently-used data may require in-memory caching (with periodic persistence) or fast SSDs. Archival data accessed infrequently can use slower, cheaper storage tiers.

Most applications combine multiple persistence mechanisms. A Flask web application might store user accounts and transactions in PostgreSQL, uploaded images in Azure Blob Storage, and session data in Redis. Each mechanism handles the data it suits best.

## Persistence in Cloud Environments

Cloud platforms provide managed persistence services that handle operational complexity. Rather than installing and maintaining a PostgreSQL server, Azure Database for PostgreSQL runs the database as a service, managing backups, updates, and high availability.

This model shifts concerns. Instead of managing storage hardware and database software, the focus moves to data modeling, access patterns, and performance tuning. The cloud provider handles durability through replication, availability through redundant infrastructure, and scalability through resource adjustment.

Managed services introduce dependencies and constraints. Data resides in the provider's infrastructure, accessed through their APIs. Moving between providers requires data migration. The provider's operational decisions—maintenance windows, version updates, regional availability—affect application behavior.

These trade-offs typically favor managed services for most applications. The operational burden of running production databases exceeds the flexibility benefit of self-managed infrastructure. Understanding what the managed service provides and how it differs from self-hosted alternatives enables informed decisions about which approach fits the project's constraints.

## Summary

Persistence ensures that data outlives the processes that create it, enabling applications to maintain state across restarts, crashes, and system changes. Storage systems provide space for data; databases add structure and query capabilities. The choice between block storage, file storage, object storage, relational databases, and NoSQL databases depends on data characteristics, access patterns, and consistency requirements. Cloud-managed services simplify operations by handling infrastructure complexity, allowing developers to focus on data modeling and application logic rather than storage administration.
