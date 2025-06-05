// Python Practice Lab - Main JavaScript File
class PythonLab {
    constructor() {
        this.pyodide = null;
        this.editor = null;
        this.problems = null;
        this.currentProblem = null;
        this.isInitialized = false;

        this.init();
    }

    async init() {
        try {
            // Initialize CodeMirror editor
            this.initCodeEditor();

            // Load problems from JSON
            await this.loadProblems();

            // Initialize Pyodide
            await this.initPyodide();

            // Setup event listeners
            this.setupEventListeners();

            console.log('Python Lab initialized successfully!');
            this.isInitialized = true;
        } catch (error) {
            console.error('Error initializing Python Lab:', error);
            this.showError('Lỗi khởi tạo: ' + error.message);
        }
    }

    initCodeEditor() {
        const textarea = document.getElementById('codeEditor');
        this.editor = CodeMirror.fromTextArea(textarea, {
            mode: 'python',
            theme: 'default',
            lineNumbers: true,
            indentUnit: 4,
            matchBrackets: true,
            autoCloseBrackets: true,
            lineWrapping: true,
            gutters: ["CodeMirror-linenumbers"],
            extraKeys: {
                "Tab": "indentMore",
                "Shift-Tab": "indentLess"
            }
        });

        // Refresh editor after DOM updates
        setTimeout(() => {
            this.editor.refresh();
        }, 100);

        // Enable run button when code is typed
        this.editor.on('change', () => {
            const runButton = document.getElementById('runButton');
            if (this.currentProblem && this.editor.getValue().trim()) {
                runButton.disabled = false;
            }
        });
    }

    async loadProblems() {
        try {
            const response = await fetch('problems.json');
            this.problems = await response.json();
            this.renderProblemList();
        } catch (error) {
            console.error('Error loading problems:', error);
            // Use default problems if file doesn't exist
            this.problems = this.getDefaultProblems();
            this.renderProblemList();
        }
    }

    getDefaultProblems() {
        return {
            "problems": [
                {
                    "id": 1,
                    "title": "Hello World",
                    "description": "Viết chương trình in ra màn hình dòng chữ 'Hello, World!'",
                    "difficulty": "Dễ",
                    "starter_code": "# Viết code của bạn ở đây\nprint('Hello, World!')",
                    "test_cases": [
                        {
                            "description": "In ra 'Hello, World!'",
                            "input": "",
                            "expected_output": "Hello, World!"
                        }
                    ]
                },
                {
                    "id": 2,
                    "title": "Tính tổng hai số",
                    "description": "Viết hàm add(a, b) trả về tổng của hai số a và b",
                    "difficulty": "Dễ",
                    "starter_code": "def add(a, b):\n    # Viết code của bạn ở đây\n    return a + b",
                    "test_cases": [
                        {
                            "description": "add(2, 3) = 5",
                            "input": "add(2, 3)",
                            "expected_output": "5"
                        },
                        {
                            "description": "add(-1, 1) = 0",
                            "input": "add(-1, 1)",
                            "expected_output": "0"
                        },
                        {
                            "description": "add(10, 20) = 30",
                            "input": "add(10, 20)",
                            "expected_output": "30"
                        }
                    ]
                },
                {
                    "id": 3,
                    "title": "Kiểm tra số chẵn lẻ",
                    "description": "Viết hàm is_even(n) trả về True nếu n là số chẵn, False nếu n là số lẻ",
                    "difficulty": "Dễ",
                    "starter_code": "def is_even(n):\n    # Viết code của bạn ở đây\n    return n % 2 == 0",
                    "test_cases": [
                        {
                            "description": "is_even(4) = True",
                            "input": "is_even(4)",
                            "expected_output": "True"
                        },
                        {
                            "description": "is_even(7) = False",
                            "input": "is_even(7)",
                            "expected_output": "False"
                        },
                        {
                            "description": "is_even(0) = True",
                            "input": "is_even(0)",
                            "expected_output": "True"
                        }
                    ]
                },
                {
                    "id": 4,
                    "title": "Tìm số lớn nhất trong danh sách",
                    "description": "Viết hàm find_max(numbers) trả về số lớn nhất trong danh sách numbers",
                    "difficulty": "Trung bình",
                    "starter_code": "def find_max(numbers):\n    # Viết code của bạn ở đây\n    if not numbers:\n        return None\n    return max(numbers)",
                    "test_cases": [
                        {
                            "description": "find_max([1, 3, 2]) = 3",
                            "input": "find_max([1, 3, 2])",
                            "expected_output": "3"
                        },
                        {
                            "description": "find_max([-1, -5, -2]) = -1",
                            "input": "find_max([-1, -5, -2])",
                            "expected_output": "-1"
                        },
                        {
                            "description": "find_max([10]) = 10",
                            "input": "find_max([10])",
                            "expected_output": "10"
                        }
                    ]
                },
                {
                    "id": 5,
                    "title": "Đếm từ trong chuỗi",
                    "description": "Viết hàm count_words(text) đếm số từ trong chuỗi text (phân tách bằng dấu cách)",
                    "difficulty": "Trung bình",
                    "starter_code": "def count_words(text):\n    # Viết code của bạn ở đây\n    if not text.strip():\n        return 0\n    return len(text.split())",
                    "test_cases": [
                        {
                            "description": "count_words('hello world') = 2",
                            "input": "count_words('hello world')",
                            "expected_output": "2"
                        },
                        {
                            "description": "count_words('python is great') = 3",
                            "input": "count_words('python is great')",
                            "expected_output": "3"
                        },
                        {
                            "description": "count_words('') = 0",
                            "input": "count_words('')",
                            "expected_output": "0"
                        }
                    ]
                }
            ]
        };
    }

    async initPyodide() {
        try {
            console.log('Loading Pyodide...');
            this.pyodide = await loadPyodide({
                indexURL: "https://cdn.jsdelivr.net/pyodide/v0.24.1/full/"
            });
            console.log('Pyodide loaded successfully!');
        } catch (error) {
            throw new Error('Không thể tải Pyodide: ' + error.message);
        }
    }

    renderProblemList() {
        const problemList = document.getElementById('problemList');
        problemList.innerHTML = '';

        this.problems.problems.forEach(problem => {
            const problemCard = document.createElement('div');
            problemCard.className = 'problem-card';
            problemCard.innerHTML = `
                <div class="d-flex justify-content-between align-items-start mb-1">
                    <h6 class="mb-0 flex-grow-1"><i class="fas fa-puzzle-piece"></i> ${problem.title}</h6>
                    <span class="badge ${this.getDifficultyBadgeClass(problem.difficulty)} ms-2" 
                          title="${problem.difficulty}" 
                          data-bs-toggle="tooltip">${this.getDifficultyIcon(problem.difficulty)}</span>
                </div>
                <p class="text-muted mb-0 small">${problem.description}</p>
            `;

            problemCard.addEventListener('click', () => {
                this.selectProblem(problem);
            });

            problemList.appendChild(problemCard);
        });

        // Initialize tooltips for difficulty badges
        const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
        tooltipTriggerList.map(function (tooltipTriggerEl) {
            return new bootstrap.Tooltip(tooltipTriggerEl);
        });
    }

    getDifficultyBadgeClass(difficulty) {
        switch (difficulty) {
            case 'Dễ': return 'bg-success';
            case 'Trung bình': return 'bg-warning';
            case 'Khó': return 'bg-danger';
            default: return 'bg-secondary';
        }
    }

    getDifficultyIcon(difficulty) {
        switch (difficulty) {
            case 'Dễ': return '<i class="fas fa-star"></i>';
            case 'Trung bình': return '<i class="fas fa-star-half-alt"></i>';
            case 'Khó': return '<i class="fas fa-fire"></i>';
            default: return '<i class="fas fa-question"></i>';
        }
    }

    selectProblem(problem) {
        // Remove active class from all cards
        document.querySelectorAll('.problem-card').forEach(card => {
            card.classList.remove('active');
        });

        // Add active class to selected card
        event.target.closest('.problem-card').classList.add('active');

        this.currentProblem = problem;

        // Show problem details
        document.getElementById('problemDetails').classList.remove('hidden');

        // Update problem description in new format
        document.getElementById('problemTitle').innerHTML = `<i class="fas fa-info-circle"></i> Mô tả bài tập:`;
        document.getElementById('problemDescription').innerHTML = problem.description;

        // Update difficulty badge
        const difficultyBadge = document.getElementById('difficultyBadge');
        difficultyBadge.textContent = problem.difficulty;
        difficultyBadge.className = `difficulty-badge difficulty-${problem.difficulty.toLowerCase().replace(' ', '-')}`;

        // Set starter code
        this.editor.setValue(problem.starter_code || '# Viết code của bạn ở đây\n');

        // Refresh editor to ensure proper rendering
        setTimeout(() => {
            this.editor.refresh();
        }, 50);

        // Enable/disable run button
        const runButton = document.getElementById('runButton');
        if (runButton) {
            runButton.disabled = !this.isInitialized;
        }

        // Hide previous results
        document.getElementById('resultPanel').classList.add('hidden');
    }

    setupEventListeners() {
        document.getElementById('runButton').addEventListener('click', () => {
            this.runCode();
        });

        // Allow Ctrl+Enter to run code
        document.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                e.preventDefault();
                if (this.currentProblem && !document.getElementById('runButton').disabled) {
                    this.runCode();
                }
            }
        });
    }

    async runCode() {
        if (!this.isInitialized || !this.currentProblem) {
            this.showError('Chưa sẵn sàng để chạy code');
            return;
        }

        const code = this.editor.getValue();
        if (!code.trim()) {
            this.showError('Vui lòng nhập code trước khi chạy');
            return;
        }

        // Show loading
        this.showLoading(true);
        document.getElementById('resultPanel').classList.add('hidden');

        try {
            // Test the code with all test cases
            const results = await this.runTestCases(code, this.currentProblem.test_cases);
            this.displayResults(results);
        } catch (error) {
            this.showError('Lỗi thực thi: ' + error.message);
        } finally {
            this.showLoading(false);
        }
    }

    async runTestCases(userCode, testCases) {
        const results = [];

        for (let i = 0; i < testCases.length; i++) {
            const testCase = testCases[i];
            try {
                // Clear previous variables and setup environment
                this.pyodide.runPython(`
import sys
import io
from contextlib import redirect_stdout
                `);

                let output;
                let error = null;                if (testCase.input && !testCase.input.includes('(')) {
                    // This is a test case with input data (for input() function)
                    const inputLines = testCase.input.split('\n');
                    
                    // Create mock input function with predefined data
                    const mockInputCode = `
# Mock input function with predefined data
input_data = ${JSON.stringify(inputLines)}
input_index = 0

def input(prompt=''):
    global input_index, input_data
    if input_index < len(input_data):
        value = input_data[input_index]
        input_index += 1
        # Only print prompt if it's not empty, don't print the input value
        if prompt:
            print(prompt, end='')
        return value
    return ''

# Reset input index for each test
input_index = 0
                    `;
                    
                    this.pyodide.runPython(mockInputCode);
                    
                    // Capture output for programs using input()
                    const captureCode = `
f = io.StringIO()
with redirect_stdout(f):
    exec("""${userCode.replace(/"/g, '\\"').replace(/\n/g, '\\n')}""")
output = f.getvalue().strip()
                    `;
                    this.pyodide.runPython(captureCode);
                    output = this.pyodide.globals.get('output');

                } else if (testCase.input && testCase.input.includes('(')) {
                    // This is a function call test case
                    this.pyodide.runPython(userCode);

                    const captureCode = `
f = io.StringIO()
with redirect_stdout(f):
    result = ${testCase.input}
    print(result)
output = f.getvalue().strip()
                    `;
                    this.pyodide.runPython(captureCode);
                    output = this.pyodide.globals.get('output');

                } else {
                    // Program without input (like Hello World)
                    const captureCode = `
f = io.StringIO()
with redirect_stdout(f):
    exec("""${userCode.replace(/"/g, '\\"').replace(/\n/g, '\\n')}""")
output = f.getvalue().strip()
                    `;
                    this.pyodide.runPython(captureCode);
                    output = this.pyodide.globals.get('output');
                }

                // Clean up output by removing input prompts if they exist
                const cleanedOutput = this.cleanOutput(output, testCase);

                const passed = cleanedOutput === testCase.expected_output;
                results.push({
                    testCase: testCase,
                    output: cleanedOutput,
                    passed: passed,
                    error: null
                });

            } catch (err) {
                console.error('Test case error:', err);
                results.push({
                    testCase: testCase,
                    output: null,
                    passed: false,
                    error: err.message || err.toString()
                });
            }
        }

        return results;
    }

    cleanOutput(output, testCase) {
        if (!output) return output;

        // For programs that use input(), clean up any input-related artifacts
        let lines = output.split('\n');
        let cleanedLines = [];

        for (let line of lines) {
            // Skip lines that look like input prompts (Vietnamese)
            if (line.includes('Nhập') && line.includes(':')) {
                continue;
            }
            // Skip lines that are just numbers (input values echoed back)
            if (testCase.input && !testCase.input.includes('(')) {
                const inputValues = testCase.input.split('\n');
                if (inputValues.includes(line.trim())) {
                    continue;
                }
            }
            // Skip empty lines that might result from filtering
            if (line.trim() !== '') {
                cleanedLines.push(line);
            }
        }

        return cleanedLines.join('\n');
    }

    displayResults(results) {
        const resultPanel = document.getElementById('resultPanel');
        const testResults = document.getElementById('testResults');

        let allPassed = true;
        let passedCount = 0;

        testResults.innerHTML = '';

        results.forEach((result, index) => {
            const testDiv = document.createElement('div');
            testDiv.className = `test-case ${result.passed ? 'passed' : 'failed'}`;

            if (result.passed) {
                passedCount++;
                testDiv.innerHTML = `
                    <div class="d-flex justify-content-between align-items-center">
                        <strong><i class="fas fa-check-circle text-success"></i> Test ${index + 1}: ${result.testCase.description}</strong>
                        <span class="badge bg-success">PASS</span>
                    </div>
                    <div class="mt-2">
                        <small class="text-muted">Kết quả: ${result.output}</small>
                    </div>
                `;
            } else {
                allPassed = false;
                testDiv.innerHTML = `
                    <div class="d-flex justify-content-between align-items-center">
                        <strong><i class="fas fa-times-circle text-danger"></i> Test ${index + 1}: ${result.testCase.description}</strong>
                        <span class="badge bg-danger">FAIL</span>
                    </div>
                    <div class="mt-2">
                        <div><strong>Mong đợi:</strong> <code>${result.testCase.expected_output}</code></div>
                        <div><strong>Kết quả:</strong> <code>${result.output || 'Lỗi'}</code></div>
                        ${result.error ? `<div class="text-danger mt-1"><strong>Lỗi:</strong> ${result.error}</div>` : ''}
                    </div>
                `;
            }

            testResults.appendChild(testDiv);
        });

        // Add summary
        const summaryDiv = document.createElement('div');
        summaryDiv.className = allPassed ? 'success-message mt-3' : 'alert alert-warning mt-3';
        summaryDiv.innerHTML = `
            <h6><i class="fas fa-chart-pie"></i> Tổng kết</h6>
            <p class="mb-0">Đã pass ${passedCount}/${results.length} test cases</p>
            ${allPassed ? '<p class="mb-0"><i class="fas fa-trophy"></i> Chúc mừng! Bạn đã hoàn thành bài tập!</p>' : ''}
        `;
        testResults.appendChild(summaryDiv);

        resultPanel.classList.remove('hidden');
    }

    showLoading(show) {
        const loading = document.getElementById('loadingSpinner');
        if (show) {
            loading.style.display = 'block';
        } else {
            loading.style.display = 'none';
        }
    }

    showError(message) {
        const resultPanel = document.getElementById('resultPanel');
        const testResults = document.getElementById('testResults');

        testResults.innerHTML = `<div class="error-message">${message}</div>`;
        resultPanel.classList.remove('hidden');
        this.showLoading(false);
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new PythonLab();
});
