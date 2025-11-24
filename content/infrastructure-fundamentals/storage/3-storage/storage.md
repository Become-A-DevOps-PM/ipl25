+++
title = "Storage"
weight = 3
date = 2024-11-19
draft = false
+++

[Watch the presentation]({{< relref "storage-slides.md" >}})

[Se presentationen på svenska]({{< relref "storage-slides-swe.md" >}})

Applications require persistent data that survives beyond a single execution cycle. User accounts, transaction records, uploaded files, and application state must remain available after servers restart or processes terminate. **Storage** systems provide this persistence, managing how data is saved, retrieved, and maintained across an infrastructure.

Understanding storage requires more than knowing it "saves data." Different storage architectures solve different problems—some optimize for fast access to small blocks of data, others for storing massive volumes of unstructured files, and others for shared access across multiple systems. Choosing appropriate storage depends on understanding these distinctions and matching them to application requirements.

## Storage Characteristics

Storage systems vary along several dimensions. These characteristics determine how a storage solution performs and what workloads it suits.

### Capacity

**Capacity** measures the total volume of data a storage system can hold. Consumer laptops typically have 256 GB to 1 TB of storage. Enterprise systems scale to terabytes (TB) or petabytes (PB)—thousands or millions of gigabytes.

Cloud storage abstracts capacity concerns. Instead of purchasing a disk with fixed capacity, cloud storage scales as data grows, with billing based on actual usage. This eliminates the need to predict future storage requirements, though it introduces ongoing operational costs.

### Performance

Storage performance determines how quickly data can be written and read. Two metrics capture this:

**Throughput** measures the volume of data transferred per unit of time, typically expressed in megabytes per second (MB/s) or gigabytes per second (GB/s). High throughput matters for workloads that process large files—video encoding, database backups, log analysis.

**Latency** measures the time between requesting data and receiving the first byte, often in milliseconds or microseconds. Low latency matters for databases and applications making many small, frequent storage operations. A database executing thousands of queries per second requires storage that responds in microseconds, not milliseconds.

These metrics often trade off. Storage optimized for throughput may have higher latency; storage optimized for latency may have lower throughput. Understanding which characteristic matters for a specific workload guides storage selection.

### Redundancy

**Redundancy** duplicates data to ensure availability when hardware fails. A single hard drive eventually fails—industry failure rates suggest 1-5% of drives fail annually. Without redundancy, that failure means data loss.

Redundancy strategies range from simple to sophisticated. **RAID** (Redundant Array of Independent Disks) combines multiple physical drives into a logical unit. RAID 1 mirrors data across two drives; if one fails, the other continues serving requests. RAID 5 distributes data and parity information across three or more drives, allowing any single drive to fail without data loss.

Cloud storage implements redundancy differently. Data is replicated across multiple physical locations automatically. Azure Blob Storage, for example, maintains three copies of each object within a region by default, with options to replicate across geographic regions for disaster recovery.

Redundancy consumes additional storage—mirroring requires double the capacity, and distributed parity schemes require roughly 1.5x to 2x capacity. This cost trades against the risk of data loss, which for most applications is unacceptable.

### Scalability

**Scalability** describes how storage capacity grows as data volume increases. Traditional storage requires adding physical drives, installing them in servers, and configuring them into existing storage systems. This process takes time and requires predicting future capacity needs.

Cloud storage scales automatically. As more data is written, the storage service allocates additional capacity behind the scenes. This elastic scaling eliminates capacity planning for storage, though it requires planning for the associated costs.

### Access Methods

Different storage systems use different protocols for reading and writing data. These protocols reflect the underlying storage architecture and determine how applications interact with storage.

**File protocols** like NFS (Network File System) and SMB (Server Message Block) present storage as a filesystem that can be mounted on multiple machines. Applications interact with storage using standard filesystem operations—open, read, write, close.

**Block protocols** like iSCSI and Fibre Channel present storage as raw block devices. The operating system formats these blocks with a filesystem, and applications access data through that filesystem. Block protocols provide lower-level access with less overhead than file protocols.

**Object protocols** use HTTP APIs to store and retrieve data as objects with unique identifiers. Rather than organizing data into files and directories, object storage treats each piece of data as a standalone object with metadata. Applications use RESTful APIs to put and get objects.

## Storage Types

Storage systems organize into three primary types, each with distinct architectures and use cases.

### Block Storage

**Block storage** divides storage space into fixed-size blocks, each with a unique address. The operating system manages these blocks, organizing them into filesystems that applications use. Block storage appears to the OS as a direct-attached disk, even when the physical storage is remote.

Block storage provides low latency because it operates at a fundamental level—the OS and filesystem control exactly how data is organized and accessed. This makes block storage suitable for databases, which require fast, frequent access to specific data locations.

Cloud platforms offer block storage as a service. **Azure Managed Disks** provide block storage that attaches to virtual machines. The VM treats the managed disk as a local drive, though the storage infrastructure is distributed and redundant. This abstraction provides the performance characteristics of local storage with the durability and management benefits of cloud infrastructure.

Block storage scales vertically—increasing capacity requires attaching larger disks or additional volumes. Multiple systems can share block storage, though this requires filesystem-level coordination to prevent corruption.

### File Storage

**File storage** presents data as files organized into directories. Multiple clients can mount the same file storage simultaneously, reading and writing shared files. This shared access model suits collaborative workloads where multiple systems need to access the same data.

**NAS** (Network-Attached Storage) implements file storage over a network. A NAS device contains storage hardware and runs a filesystem, exporting that filesystem to clients using NFS or SMB protocols. Clients mount the NAS filesystem and interact with it using standard file operations.

Cloud file storage provides the NAS model as a managed service. **Azure Files** exposes file shares over SMB protocol that can be mounted by VMs, containers, or on-premises systems. The underlying infrastructure handles redundancy, scaling, and backups automatically.

File storage suits workloads requiring shared access—application configuration files, shared document repositories, centralized logging. The trade-off compared to block storage is higher latency, since the file protocol adds overhead and the storage is accessed over a network.

### Object Storage

**Object storage** treats each piece of data as a self-contained object with metadata and a unique identifier. Rather than navigating a directory tree, applications reference objects by their ID or path. Objects are immutable—updating an object means writing a new version, not modifying the existing data in place.

This architecture enables massive scalability. Object storage systems distribute objects across many physical devices and locations, replicating them for durability. The immutable design simplifies consistency—there are no file locks or concurrent write conflicts to manage.

**Azure Blob Storage** provides object storage with HTTP-based APIs. Applications PUT objects to storage and GET them using REST calls or SDKs that wrap those APIs. Object storage suits unstructured data that scales to large volumes—images, videos, backups, logs, static website content.

Object storage has higher latency than block or file storage. Accessing data requires HTTP requests rather than filesystem calls, adding network and protocol overhead. This makes object storage unsuitable for database workloads requiring low-latency access. It excels for workloads that read entire objects—serving images to web browsers, processing uploaded files, long-term backup storage.

## Storage Protocols

Protocols define how systems communicate with storage. Understanding these protocols clarifies why different storage types behave differently.

**NFS (Network File System)** originated in UNIX environments and remains common in Linux systems. NFS exports a directory from a server, allowing clients to mount it as if it were a local filesystem. Multiple clients can mount the same NFS export simultaneously, enabling shared file access.

**SMB (Server Message Block)**, also called CIFS, dominates Windows environments but works across platforms. SMB provides file sharing with access control—permissions determine which users can read, write, or modify specific files. Azure Files uses SMB, making cloud file storage accessible from Windows, Linux, and macOS systems.

**iSCSI (Internet Small Computer System Interface)** transmits SCSI commands over IP networks. This enables block storage to be accessed remotely while appearing as a local disk. iSCSI connects servers to SAN (Storage Area Network) devices, which provide enterprise-scale block storage with high performance and redundancy.

**Fibre Channel** provides dedicated high-speed networking for storage, primarily in enterprise data centers. Fibre Channel switches connect servers to storage arrays with low latency and high bandwidth. The dedicated infrastructure and specialized hardware make Fibre Channel more expensive than iSCSI, but the performance and reliability suit mission-critical applications.

**NVMe (Non-Volatile Memory Express)** optimizes access to SSDs by using PCIe bus communication. Traditional protocols like SATA were designed for mechanical hard drives with rotating platters; NVMe redesigns storage communication for solid-state memory, achieving much lower latency and higher throughput. NVMe drives connected via PCIe can reach microsecond latencies and multi-gigabyte-per-second throughput.

**HTTP/HTTPS** serves as the protocol for object storage. Applications make standard web requests—PUT to upload objects, GET to retrieve them, DELETE to remove them. This approach leverages widespread HTTP infrastructure and enables object storage to scale globally using CDN (Content Delivery Network) technologies.

The protocol influences storage behavior. Block protocols (iSCSI, Fibre Channel, NVMe) provide low latency because they minimize overhead. File protocols (NFS, SMB) add abstraction for shared access, increasing latency slightly. HTTP adds more overhead but enables massive scalability and global distribution.

## Ephemeral Storage

Not all storage persists. **Ephemeral storage** exists only during the lifetime of a compute instance. When a VM shuts down or a container terminates, ephemeral storage and its contents disappear.

Cloud VMs often include local ephemeral storage—typically SSDs physically installed in the host server. This storage delivers excellent performance because it is directly attached hardware. Applications can use it for temporary files, caches, or intermediate computation results.

The critical constraint is ephemerality. Any data that must survive instance restarts must be stored elsewhere—on persistent block storage, file storage, or object storage. Ephemeral storage suits workloads that regenerate data on startup or where data loss is acceptable—session caches, temporary processing files, build artifacts.

Understanding the distinction between ephemeral and persistent storage prevents data loss. A database configured to write to ephemeral storage loses all data when the VM reboots. That same database configured to write to persistent block storage preserves data across restarts.

## Storage in Practice

Different workloads require different storage characteristics. Matching storage type to use case affects both performance and cost.

**Database workloads** typically use block storage. Databases make many small, random read and write operations, requiring low latency. Block storage attached to the database server provides the necessary performance. Cloud platforms offer block storage with different performance tiers—standard HDDs for development databases, premium SSDs for production workloads requiring consistent low latency.

**File sharing and collaboration** uses file storage. Multiple users editing documents, teams accessing shared configuration files, or applications reading centralized data benefit from the shared-access model. File storage handles the coordination required for concurrent access, preventing file corruption when multiple clients modify the same data.

**Backup and archival** leverages object storage. Backups often grow to terabytes or petabytes, making scalability critical. Object storage scales automatically and replicates data geographically for durability. The higher latency compared to block storage is acceptable because backups are written occasionally and restored rarely. Object storage pricing per gigabyte is lower than block or file storage, making it economical for large volumes of infrequently accessed data.

**Static web content** uses object storage with CDN distribution. Images, videos, JavaScript files, and CSS served to web browsers do not require low-latency storage—they require global distribution. Object storage integrated with a CDN replicates content to edge locations worldwide, serving content from the location nearest to each user.

**Application runtime storage** depends on the application architecture. Stateless applications store session data in databases or distributed caches, not on local storage. Stateful applications requiring fast local access might use block storage attached to the application server. Container orchestration platforms can mount different storage types into containers—block storage for databases, file storage for shared configuration, object storage for uploaded files.

## Cloud Storage Services

Cloud platforms abstract storage infrastructure into managed services. This shifts operational responsibility from infrastructure management to capacity and cost planning.

**Azure Blob Storage** provides object storage with different access tiers. The hot tier stores frequently accessed data with higher storage costs but lower access costs. The cool tier stores infrequently accessed data with lower storage costs but higher access costs. The archive tier stores data that is rarely accessed, with the lowest storage costs but requiring rehydration before access. Matching data to the appropriate tier optimizes costs.

**Azure Managed Disks** provides block storage for VMs with different performance tiers—Standard HDD, Standard SSD, Premium SSD, and Ultra Disk. Each tier offers different latency, throughput, and IOPS (Input/Output Operations Per Second) guarantees at different price points. Selecting the appropriate tier depends on application performance requirements and budget constraints.

**Azure Files** provides file storage accessible via SMB protocol. Multiple VMs, containers, or on-premises systems can mount the same file share simultaneously. Azure Files handles replication and backup, eliminating the operational overhead of managing a NAS device.

These services share common patterns: consumption-based pricing, automatic redundancy, snapshot and backup capabilities, and security through access controls and encryption. The operational model shifts from "provision and maintain infrastructure" to "configure and monitor services."

## Redundancy Strategies

Data loss is unacceptable for most applications. Redundancy protects against hardware failure, but different redundancy strategies offer different protection levels and costs.

**Local redundancy** replicates data within a single data center. Azure LRS (Locally Redundant Storage) maintains three copies of each object across different storage hardware in one facility. This protects against drive or server failure but not against data center-level disasters.

**Zone redundancy** replicates data across multiple data centers within a region. Azure ZRS (Zone-Redundant Storage) distributes copies across three availability zones—physically separate facilities with independent power, cooling, and networking. This protects against facility-level failures while keeping data within a geographic region.

**Geographic redundancy** replicates data across regions separated by hundreds or thousands of kilometers. Azure GRS (Geo-Redundant Storage) asynchronously replicates data to a secondary region. If the primary region becomes unavailable due to disaster, data remains accessible from the secondary region. This provides the highest durability but also the highest cost.

RAID remains relevant for on-premises storage. RAID 1 mirrors data across two drives—simplest redundancy but highest cost per gigabyte. RAID 5 distributes data and parity across three or more drives, tolerating one drive failure. RAID 6 uses dual parity, tolerating two simultaneous drive failures. RAID 10 combines mirroring and striping for both redundancy and performance, requiring at least four drives.

Choosing redundancy strategy depends on data criticality, recovery time objectives, and budget. Financial transaction data might justify geo-redundant storage; temporary build artifacts might need only local redundancy or none at all.

## Summary

Storage systems provide the persistent data layer that applications require. Block storage offers low latency for database workloads, file storage enables shared access for collaborative workloads, and object storage scales to massive volumes for unstructured data. Different protocols—NFS, SMB, iSCSI, HTTP—reflect these architectural differences and determine how applications interact with storage. Understanding storage characteristics—capacity, performance, redundancy, scalability—enables matching storage type to workload requirements. Cloud storage abstracts infrastructure complexity into managed services, shifting operational focus from hardware management to configuration and cost optimization.