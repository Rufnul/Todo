'use client';

export default function DeleteConfirmationModal({ isOpen, onClose, onConfirm, itemName }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            {/* Background overlay */}
            <div
                className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
                onClick={onClose}
            ></div>

            {/* Modal container */}
            <div className="flex min-h-full items-center justify-center p-4">
                <div className="relative transform overflow-hidden rounded-lg bg-white shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                    {/* Modal content */}
                    <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                        <div className="sm:flex sm:items-start">
                            <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                                <svg
                                    className="h-6 w-6 text-red-600"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.986-.833-2.756 0L4.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                                    />
                                </svg>
                            </div>
                            <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                                <h3 className="text-lg font-semibold leading-6 text-gray-900">
                                    Delete Confirmation
                                </h3>
                                <div className="mt-2">
                                    <p className="text-sm text-gray-500">
                                        Are you sure you want to delete <span className="font-semibold text-gray-700">"{itemName}"</span>?
                                    </p>
                                    <p className="mt-1 text-sm text-gray-500">
                                        This action cannot be undone.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Modal actions */}
                    <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                        <button
                            type="button"
                            onClick={onConfirm}
                            className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
                        >
                            Delete
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}