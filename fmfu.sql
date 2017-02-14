-- Follow me follow you database table structure.
-- --------------------------------------------------------

--
-- Table structure for table `fmfu`
--

CREATE TABLE `fmfu` (
  `no` bigint(20) NOT NULL,
  `deviceId` varchar(8) NOT NULL,
  `latitude` double NOT NULL,
  `longitude` double NOT NULL,
  `accuracy` double DEFAULT NULL
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
