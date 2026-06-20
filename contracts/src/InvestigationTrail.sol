// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

contract InvestigationTrail {
    uint256 public caseCount;

    struct Finding {
        address agent;
        uint256 caseId;
        string domain;
        string url;
        uint256 confidence;
        uint256 timestamp;
        string metadata;
        string agentName;
    }

    struct FormatSpec {
        address agent;
        uint256 caseId;
        string platform;
        string formatType;
        string contact;
        string subjectTemplate;
        string bodyTemplate;
        uint256 timestamp;
        string agentName;
    }

    struct Complaint {
        address agent;
        uint256 caseId;
        string platform;
        string formatType;
        string complaintData;
        uint256 timestamp;
        string agentName;
    }

    Finding[] public findings;
    FormatSpec[] public formatSpecs;
    Complaint[] public complaints;

    mapping(uint256 => uint256[]) private caseFindingIndices;
    mapping(uint256 => uint256[]) private caseFormatIndices;
    mapping(uint256 => uint256[]) private caseComplaintIndices;

    mapping(uint256 => address) public caseOwner;
    mapping(uint256 => string) public caseImageHash;
    mapping(uint256 => uint256) public caseTimestamp;

    event CaseCreated(uint256 indexed caseId, address indexed owner, string imageHash, uint256 timestamp);
    event FindingSubmitted(uint256 indexed caseId, address indexed agent, string agentName, string domain, string url, uint256 confidence, uint256 timestamp);
    event FormatSpecSubmitted(uint256 indexed caseId, address indexed agent, string agentName, string platform, string formatType, uint256 timestamp);
    event ComplaintSubmitted(uint256 indexed caseId, address indexed agent, string agentName, string platform, string formatType, uint256 timestamp);

    function createCase(string memory imageHash) external returns (uint256) {
        caseCount++;
        uint256 caseId = caseCount;
        caseOwner[caseId] = msg.sender;
        caseImageHash[caseId] = imageHash;
        caseTimestamp[caseId] = block.timestamp;
        emit CaseCreated(caseId, msg.sender, imageHash, block.timestamp);
        return caseId;
    }

    function submitFinding(
        uint256 caseId,
        string memory domain,
        string memory url,
        uint256 confidence,
        string memory metadata,
        string memory agentName
    ) external {
        require(caseId > 0 && caseId <= caseCount, "Case does not exist");
        findings.push(Finding({
            agent: msg.sender,
            caseId: caseId,
            domain: domain,
            url: url,
            confidence: confidence,
            timestamp: block.timestamp,
            metadata: metadata,
            agentName: agentName
        }));
        uint256 idx = findings.length - 1;
        caseFindingIndices[caseId].push(idx);
        emit FindingSubmitted(caseId, msg.sender, agentName, domain, url, confidence, block.timestamp);
    }

    function submitFormatSpec(
        uint256 caseId,
        string memory platform,
        string memory formatType,
        string memory contact,
        string memory subjectTemplate,
        string memory bodyTemplate,
        string memory agentName
    ) external {
        require(caseId > 0 && caseId <= caseCount, "Case does not exist");
        formatSpecs.push(FormatSpec({
            agent: msg.sender,
            caseId: caseId,
            platform: platform,
            formatType: formatType,
            contact: contact,
            subjectTemplate: subjectTemplate,
            bodyTemplate: bodyTemplate,
            timestamp: block.timestamp,
            agentName: agentName
        }));
        uint256 idx = formatSpecs.length - 1;
        caseFormatIndices[caseId].push(idx);
        emit FormatSpecSubmitted(caseId, msg.sender, agentName, platform, formatType, block.timestamp);
    }

    function submitComplaint(
        uint256 caseId,
        string memory platform,
        string memory formatType,
        string memory complaintData,
        string memory agentName
    ) external {
        require(caseId > 0 && caseId <= caseCount, "Case does not exist");
        complaints.push(Complaint({
            agent: msg.sender,
            caseId: caseId,
            platform: platform,
            formatType: formatType,
            complaintData: complaintData,
            timestamp: block.timestamp,
            agentName: agentName
        }));
        uint256 idx = complaints.length - 1;
        caseComplaintIndices[caseId].push(idx);
        emit ComplaintSubmitted(caseId, msg.sender, agentName, platform, formatType, block.timestamp);
    }

    function getCaseFindings(uint256 caseId) external view returns (Finding[] memory) {
        uint256[] memory indices = caseFindingIndices[caseId];
        Finding[] memory result = new Finding[](indices.length);
        for (uint256 i = 0; i < indices.length; i++) {
            result[i] = findings[indices[i]];
        }
        return result;
    }

    function getCaseFormatSpecs(uint256 caseId) external view returns (FormatSpec[] memory) {
        uint256[] memory indices = caseFormatIndices[caseId];
        FormatSpec[] memory result = new FormatSpec[](indices.length);
        for (uint256 i = 0; i < indices.length; i++) {
            result[i] = formatSpecs[indices[i]];
        }
        return result;
    }

    function getCaseComplaints(uint256 caseId) external view returns (Complaint[] memory) {
        uint256[] memory indices = caseComplaintIndices[caseId];
        Complaint[] memory result = new Complaint[](indices.length);
        for (uint256 i = 0; i < indices.length; i++) {
            result[i] = complaints[indices[i]];
        }
        return result;
    }

    function getCaseSummary(uint256 caseId) external view returns (
        address owner,
        string memory imageHash,
        uint256 timestamp,
        uint256 findingCount,
        uint256 formatCount,
        uint256 complaintCount
    ) {
        require(caseId > 0 && caseId <= caseCount, "Case does not exist");
        return (
            caseOwner[caseId],
            caseImageHash[caseId],
            caseTimestamp[caseId],
            caseFindingIndices[caseId].length,
            caseFormatIndices[caseId].length,
            caseComplaintIndices[caseId].length
        );
    }
}
