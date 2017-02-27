-- Follow me follow you database table structure.
-- --------------------------------------------------------

--
-- Table structure for table `fmfu`
--

CREATE TABLE `fmfu` (
  `no` bigint(20) NOT NULL,
  `deviceId` varchar(8) NOT NULL,
  `groupId` varchar(8) DEFAULT NULL,
  `name` varchar(10) DEFAULT NULL,
  `latitude` double DEFAULT '0',
  `longitude` double DEFAULT '0',
  `accuracy` double DEFAULT '0',
  `last_seen` bigint(15) DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Indexes for table `fmfu`
--
ALTER TABLE `fmfu`
  ADD PRIMARY KEY (`no`);

--
-- AUTO_INCREMENT for table `fmfu`
--
ALTER TABLE `fmfu`
  MODIFY `no` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;
