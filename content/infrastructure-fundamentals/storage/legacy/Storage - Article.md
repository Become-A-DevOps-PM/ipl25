+++
title = "Storage"
weight = 3
date = 2024-11-19
draft = false
hidden = true
+++

[Watch the presentation]({{< relref "storage-slides.md" >}})

[Se presentationen på svenska]({{< relref "storage-slides-swe.md" >}})

<!-- # Storage -->

**Storage** refers to the systems and devices used to save, retrieve, and manage data. It is ensuring that data remains persistently available for various purposes, including running applications, storing files, and maintaining databases. Storage solutions cater to a wide range of needs, from personal file storage on laptops to large-scale data storage in enterprises and cloud environments.

## Key Characteristics of Storage

Storage solutions have several critical characteristics:

1. **Capacity**:
   - Capacity refers to the total amount of data a storage system can hold. This is typically measured in gigabytes (GB), terabytes (TB), or even petabytes (PB) for larger enterprise systems.

2. **Performance**:
   - Performance in storage is determined by how quickly data can be read from or written to the storage device. This involves two key metrics:
     - **Throughput**: The amount of data that can be transferred in a given time period (e.g., MB/s).
     - **Latency**: The time it takes to access data once a request is made, often measured in milliseconds.

3. **Redundancy**:
   - Redundancy refers to the ability of a storage system to replicate data across multiple drives or locations to ensure availability in case of hardware failure. Technologies like **RAID** (Redundant Array of Independent Disks) or cloud-based replication ensure that data is not lost if one drive fails.

4. **Scalability**:
   - As data grows, storage must be able to scale to meet increasing demands. Traditional storage solutions may require the addition of physical drives, while cloud-based solutions can scale automatically as more data is stored.

5. **Access Methods**:
   - Different storage systems use various protocols and access methods to read and write data. For example, file storage uses protocols like **NFS** or **SMB**, block storage uses **iSCSI**, and object storage is accessed via HTTP APIs, such as **Amazon S3**.

## Types of Storage

**Physical Storage**: Includes **Hard Disk Drives (HDDs)**, which offer high capacity at a lower cost but with slower performance, and **Solid-State Drives (SSDs)**, which provide faster speeds and lower latency due to the use of flash memory.

**Virtualized Storage**: Solutions like **Storage Area Networks (SANs)** and **Network-Attached Storage (NAS)**. SANs provide block-level storage suitable for critical applications and databases, while NAS offers file-level storage for shared access and centralized file management.

**Cloud-Based Storage**: Includes **object storage**, which is scalable and ideal for unstructured data (e.g., **Amazon S3**, **Azure Blob Storage**), **block storage** for low-latency access and performance (e.g., **Amazon EBS**, **Azure Managed Disks**), and **file storage** for shared access (e.g., **Amazon EFS**, **Azure File Storage**).

## Storage Protocols

Storage protocols manage how data is transferred, accessed, and communicated between systems.

**NFS (Network File System)**: Common in UNIX/Linux environments, NFS enables file sharing over a network, allowing centralized management of files. It is widely used in **NAS** setups.

**SMB (Server Message Block)**: Also known as **CIFS**, this protocol is popular in Windows environments for sharing files and printers. It supports granular file access control and is compatible with other systems like macOS and Linux.

**iSCSI (Internet Small Computer System Interface)**: A block-level protocol that transmits SCSI commands over IP networks. iSCSI connects servers to storage devices in **SANs**, enabling remote storage to appear as local.

**Fibre Channel (FC)**: A high-speed protocol for SANs, known for low latency and reliability, often used in enterprise data centers for mission-critical applications.

**NVMe (Non-Volatile Memory Express)**: Optimized for SSDs, NVMe leverages **PCIe** to provide fast, low-latency access to data, surpassing older protocols like SATA and SCSI.

**HTTP/HTTPS**: Used for **object storage**, allowing applications to interact with storage services via RESTful APIs. This is common in cloud environments for services like **Amazon S3** and **Azure Blob Storage**.

| **Storage Type**   | **Common Protocols**                   | **Description**                                        |
|--------------------|-----------------------------------------|--------------------------------------------------------|
| **Block Storage**  | iSCSI, Fibre Channel, NVMe             | Provides low-latency, high-performance storage often used for databases and VMs. |
| **File Storage**   | NFS, SMB                               | Used for shared file access over a network, common in NAS setups and corporate environments. |
| **Object Storage** | HTTP/HTTPS                             | Utilized for scalable, unstructured data storage accessed via RESTful APIs, ideal for cloud storage solutions like Amazon S3 and Azure Blob Storage. |

## Ephemeral Storage

**Ephemeral storage** refers to temporary storage that is only available during the lifetime of a virtual machine (VM), container, or specific process. Once the instance is stopped, restarted, or terminated, any data stored in ephemeral storage is permanently lost. This type of storage is often used for temporary data, caches, or transient workloads where data doesn't need to persist after the process completes.

- **Use Case**: Ephemeral storage is ideal for temporary files, intermediate data during computations, or disposable logs where long-term retention is unnecessary.
  
- **Example**: In cloud environments, some VMs come with local SSD storage, which is ephemeral. Once the VM is terminated, the data on the local SSD is wiped.

## Common Use Cases for Storage

- **Application Data**: Many applications, such as databases, web apps, and enterprise software, rely on fast, reliable storage to operate effectively. For these use cases, block storage (e.g., **EBS** in AWS or **Managed Disks** in Azure) is often used to ensure low latency and high performance.
  
- **File Sharing and Collaboration**: Organizations use file storage systems like **NAS** or cloud file services (e.g., **Azure File Storage**, **Amazon EFS**) to store documents, spreadsheets, and other files that need to be accessed and edited by multiple users.

- **Backups and Disaster Recovery**: Cloud object storage (e.g., **Amazon S3**, **Azure Blob Storage**) is commonly used to store large volumes of backup data. These storage systems are highly durable and can replicate data across regions to protect against data loss.

- **Media and Content Delivery**: Video, images, and large media files are often stored in object storage systems, which can scale to petabytes of data. These files can be accessed globally using content delivery networks (CDNs) to provide fast access to end users.

## Cloud Storage Solutions

Cloud storage has transformed the way organizations manage and store data. With cloud storage, businesses no longer need to purchase and maintain physical hardware. Instead, they can take advantage of scalable, pay-as-you-go storage services offered by major cloud providers:

- **Amazon Web Services (AWS)**:
  - **S3** for object storage, **EBS** for block storage, and **EFS** for file storage.
  
- **Microsoft Azure**:
  - **Azure Blob Storage** for object storage, **Managed Disks** for block storage, and **Azure File Storage** for file sharing.
  
- **Google Cloud**:
  - **Google Cloud Storage** for object storage and **Persistent Disks** for block storage.

## Redundancy

**Redundancy in storage** refers to the practice of duplicating data to ensure availability and reliability, even in the event of hardware or software failures. By implementing redundancy, storage systems can recover or continue operating without data loss.

### Types of Redundancy

1. **RAID (Redundant Array of Independent Disks)**:
   - Combines multiple physical drives into one logical storage system.
   - Different RAID levels offer varying balances of redundancy, performance, and cost:
     - **RAID 1**: Mirroring (exact copy of data on two drives).
     - **RAID 5**: Distributed parity, allowing recovery with one failed drive.
     - **RAID 6**: Dual parity, tolerating two failed drives.
     - **RAID 10**: Combines mirroring and striping for high performance and redundancy.

2. **Cloud-Based Replication**:
   - Data is replicated across geographically dispersed locations in the cloud.
   - Ensures data availability even if an entire data center fails.

3. **Snapshots and Backups**:
   - **Snapshots**: Point-in-time copies of data stored locally or remotely.
   - **Backups**: Regularly created copies of data stored offsite for disaster recovery.

4. **Replication Across Systems**:
   - Active-active or active-passive replication between servers or data centers ensures that if one fails, the other takes over.

## Conclusion

Storage ensures data availability, with aspects like performance, scalability, and redundancy. Solutions range from physical and virtualized systems to cloud storage.