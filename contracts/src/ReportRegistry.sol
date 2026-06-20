// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

contract ReportRegistry {
    struct Report {
        uint256 caseId;
        bytes32 reportHash;
        uint256 timestamp;
        address coordinator;
        address[] agents;
        string reportURI;
        string summary;
    }

    Report[] public reports;
    mapping(uint256 => uint256) private caseReportIndex;
    mapping(uint256 => bool) private caseHasReport;

    event ReportStored(
        uint256 indexed caseId,
        bytes32 reportHash,
        address indexed coordinator,
        uint256 timestamp,
        string summary
    );

    function storeReport(
        uint256 caseId,
        bytes32 reportHash,
        address[] memory agents,
        string memory reportURI,
        string memory summary
    ) external {
        require(!caseHasReport[caseId], "Report already exists for this case");
        reports.push(Report({
            caseId: caseId,
            reportHash: reportHash,
            timestamp: block.timestamp,
            coordinator: msg.sender,
            agents: agents,
            reportURI: reportURI,
            summary: summary
        }));
        uint256 idx = reports.length - 1;
        caseReportIndex[caseId] = idx;
        caseHasReport[caseId] = true;
        emit ReportStored(caseId, reportHash, msg.sender, block.timestamp, summary);
    }

    function verifyReport(uint256 caseId) external view returns (
        bytes32 reportHash,
        uint256 timestamp,
        address coordinator,
        address[] memory agents,
        string memory reportURI,
        string memory summary
    ) {
        require(caseHasReport[caseId], "No report for this case");
        Report storage r = reports[caseReportIndex[caseId]];
        return (
            r.reportHash,
            r.timestamp,
            r.coordinator,
            r.agents,
            r.reportURI,
            r.summary
        );
    }

    function getReport(uint256 index) external view returns (Report memory) {
        require(index < reports.length, "Report does not exist");
        return reports[index];
    }

    function reportCount() external view returns (uint256) {
        return reports.length;
    }

    function hasReport(uint256 caseId) external view returns (bool) {
        return caseHasReport[caseId];
    }
}
